import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetchWorkingTimeRequest,
  fetchAvgWorkingtimeRequest,
} from '../actions';
import { useIntl } from 'react-intl';
import FilterSelects from '../../../components/Stats/FilterSelects';
import BarComponent from '../../../components/Stats/Charts/BarComponent';
import LineComponent from '../../../components/Stats/Charts/LineComponent';
import { requestGetCountriesOptionList } from '../../../containers/Admin/actions';
import {
  requestLibraryOptionList,
  requestGetInstitutionsOptionList,
  requestClearLibraryOptionList,
  requestClearInstitutionsOptionList,
} from '../../Library/actions';
import { checkRole } from '../../../utils/permissions';
import { getMaterialTypeLabel } from '../../../utils/stats';
import debounce from 'lodash/debounce';

import './style.scss';

const WorkingTime = props => {
  const {
    data_working_time,
    data_avg_working_time,
    dispatch,
    loading,
    error,
    match,
    libraries = [],
    institutions = [],
    countries = [],
  } = props;

  let intl = useIntl();

  const allOption = {
    label: intl.formatMessage({ id: 'app.global.all' }),
    value: '',
  };

  // Filters for the API call
  const [filters, setFilters] = useState({
    year: allOption,
    materialType: allOption,
    libraryId: allOption,
    institutionId: allOption,
    countryId: allOption,
  });

  // Add all option to each list
  const librariesWithAll = [
    allOption,
    ...libraries.map(lib => ({ label: lib.label, value: lib.value })),
  ];
  const institutionsWithAll = [
    allOption,
    ...institutions.map(inst => ({ label: inst.label, value: inst.value })),
  ];
  const countriesWithAll = [allOption, ...countries];

  /**
   * Dispatches the action only if the input has at least 3 characters, filtering by input
   * If the input is empty, dispatches the action to clear the list
   */
  const handleLibraryInput = debounce(input => {
    if (input.length >= 3) {
      dispatch(requestLibraryOptionList(input));
    } else if (input.length === 0) {
      dispatch(requestClearLibraryOptionList());
    }
  }, 300);

  const handleInstitutionInput = debounce(input => {
    if (input.length >= 3) {
      dispatch(requestGetInstitutionsOptionList(input));
    } else if (input.length === 0) {
      dispatch(requestClearInstitutionsOptionList());
    }
  }, 300);

  // Get libraryId from params, if present
  const libraryIdFromParams = match && match.params && match.params.library_id;

  // Check if the user has full access (super-admin or manager)
  const hasFullAccess = checkRole(props.auth, ['super-admin', 'manager']);

  /**
   * Get all countries if the user is super-admin or manager
   */
  useEffect(() => {
    if (hasFullAccess) {
      dispatch(requestGetCountriesOptionList());
    }
  }, [dispatch, hasFullAccess]);

  /**
   * Fetch data from API
   */
  useEffect(() => {
    if (!hasFullAccess && !libraryIdFromParams) {
      return;
    }

    const selectedLibraryId = libraryIdFromParams
      ? libraryIdFromParams
      : filters.libraryId.value;

    const action = fetchWorkingTimeRequest(
      filters.year.value,
      selectedLibraryId,
      filters.institutionId.value,
      filters.countryId.value,
      filters.materialType.value,
    );
    dispatch(action);

    const avgAction = fetchAvgWorkingtimeRequest(
      filters.year.value,
      selectedLibraryId,
      filters.institutionId.value,
      filters.countryId.value,
      filters.materialType.value,
    );
    dispatch(avgAction);
  }, [
    dispatch,
    filters.year.value,
    filters.libraryId.value,
    filters.institutionId.value,
    filters.countryId.value,
    filters.materialType.value,
  ]);

  const materialTypeIds = ['1', '2', '3', '4', '5'];
  const materialTypeNames = materialTypeIds.map(id =>
    getMaterialTypeLabel(id, intl),
  );

  /**
   * Displayed data for charts - Working Time - Borrowing
   */
  const borrowingDataWorkingTime = Object.values(
    data_working_time && data_working_time.as_borrower
      ? data_working_time.as_borrower
      : {},
  );

  // Array of working time labels (within a day, within a week, more than a week)
  const borrowingStatusLabels = borrowingDataWorkingTime.map(function(item) {
    return item.key;
  });

  const borrowing_datasets = materialTypeIds.map(function(matId) {
    return {
      label: materialTypeNames[matId - 1] || 'undefined',
      data: borrowingDataWorkingTime.map(function(item) {
        const bucket = item.by_material_type.buckets.find(
          b => b.key === Number(matId),
        );
        return bucket ? bucket.doc_count : 0;
      }),
    };
  });

  /**
   * Displayed data for charts - Working Time - Lending
   */
  const lendingDataWorkingTime = Object.values(
    data_working_time && data_working_time.as_lender
      ? data_working_time.as_lender
      : {},
  );

  // Array of working time labels (within a day, within a week, more than a week)
  const lendingStatusLabels = lendingDataWorkingTime.map(function(item) {
    return item.key;
  });

  const lending_datasets = materialTypeIds.map(function(matId) {
    return {
      label: materialTypeNames[matId - 1] || 'undefined',
      data: lendingDataWorkingTime.map(function(item) {
        const bucket = item.by_material_type.buckets.find(
          b => b.key === Number(matId),
        );
        return bucket ? bucket.doc_count : 0;
      }),
    };
  });

  /**
   * Line chart data
   */

  // Prepare data for line chart, in case of selectedYear = All it returns a yearly trend, otherwise it returns a monthly trend
  const prepareChartData = (apiData, selectedYear) => {
    if (!apiData) {
      return {
        labels: [],
        data: [],
      };
    }

    // If no year is selected, return yearly trend
    if (!selectedYear || selectedYear === '') {
      const years = Object.keys(apiData);
      return {
        labels: years,
        data: [
          {
            label: intl.formatMessage({
              id: 'app.stats.workingTime.average.yearlyBorrowing',
            }),
            data: years.map(year =>
              apiData[year].yearly_borrowing.value
                ? apiData[year].yearly_borrowing.value / 86400000 // Convert it to days
                : 0,
            ),
          },
          {
            label: intl.formatMessage({
              id: 'app.stats.workingTime.average.yearlyLending',
            }),
            data: years.map(year =>
              apiData[year].yearly_lending.value
                ? apiData[year].yearly_lending.value / 86400000 // Convert it to days
                : 0,
            ),
          },
        ],
      };
    }

    // If year is selected, get relative data
    const yearData = apiData[selectedYear];
    if (!yearData) {
      return {
        labels: [],
        data: [],
      };
    }

    const months = Object.keys(yearData)
      .filter(k => /^\d{4}-\d{2}$/.test(k)) // Regex to get months (format YYYY-MM)
      .sort(); // They should be already sorted but in case
    return {
      labels: months,
      data: [
        {
          label: intl.formatMessage({
            id: 'app.stats.workingTime.average.monthlyBorrowing',
          }),
          data: months.map(month =>
            yearData[month].borrowing
              ? yearData[month].borrowing / 86400000
              : 0,
          ),
        },
        {
          label: intl.formatMessage({
            id: 'app.stats.workingTime.average.monthlyLending',
          }),
          data: months.map(month =>
            yearData[month].lending ? yearData[month].lending / 86400000 : 0,
          ),
        },
      ],
    };
  };

  const { labels, data } = prepareChartData(
    data_avg_working_time,
    filters.year && filters.year.value ? filters.year.value : '',
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{intl.formatMessage({ id: 'app.stats.notAvailable' })}</div>;

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'app.stats.workingTime.header' })}</h1>

      <FilterSelects
        filters={filters}
        setFilters={setFilters}
        libraries={libraryIdFromParams ? [] : librariesWithAll}
        institutions={libraryIdFromParams ? [] : institutionsWithAll}
        countries={libraryIdFromParams ? [] : countriesWithAll}
        onLibraryInput={handleLibraryInput}
        onInstitutionInput={handleInstitutionInput}
        hasFullAccess={hasFullAccess}
      />

      {data_working_time && (
        <>
          <div className="charts-container">
            <div className="charts-box">
              <BarComponent
                title={intl.formatMessage({
                  id: 'app.stats.workingTime.borrowing.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.workingTime.borrowing.subtitle',
                  },
                  {
                    TOTAL: data_working_time.total_borrowing,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={borrowingStatusLabels}
                datasets={borrowing_datasets}
              />
            </div>
            <div className="charts-box">
              <BarComponent
                title={intl.formatMessage({
                  id: 'app.stats.workingTime.lending.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.workingTime.lending.subtitle',
                  },
                  {
                    TOTAL: data_working_time.total_lending,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={lendingStatusLabels}
                datasets={lending_datasets}
              />
            </div>
          </div>
          <div className="charts-container">
            <div className="charts-box">
              <LineComponent
                title={intl.formatMessage({
                  id: 'app.stats.workingTime.average.title',
                })}
                subtitle={intl.formatMessage({
                  id: 'app.stats.workingTime.average.subtitle',
                })}
                labels={labels}
                data={data}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  data_working_time: state.stats.working_time,
  data_avg_working_time: state.stats.avg_working_time,
  loading: state.stats.loading,
  error: state.stats.error,
  libraries: state.library.libraryOptionItemList,
  institutions: state.library.institutionsOptionList,
  countries: state.admin.countriesOptionList,
});

export default connect(mapStateToProps)(WorkingTime);
