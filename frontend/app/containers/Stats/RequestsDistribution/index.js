import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchRequestDistributionRequest } from '../actions';
import { useIntl } from 'react-intl';
import FilterSelects from '../../../components/Stats/FilterSelects';
import BarComponent from '../../../components/Stats/Charts/BarComponent';
import PieComponent from '../../../components/Stats/Charts/PieComponent';
import {
  requestGetCountriesOptionList,
} from '../../../containers/Admin/actions';
import {
  requestLibraryOptionList,
  requestGetInstitutionsOptionList,
  requestClearLibraryOptionList,
  requestClearInstitutionsOptionList,
} from '../../Library/actions';
import { checkRole } from '../../../utils/permissions';
import getMaterialTypeLabel from '../../../utils/stats';
import debounce from 'lodash/debounce';

import './style.scss';

const RequestsDistribution = props => {
  const {
    data,
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
    label: intl.formatMessage({ id: 'app.stats.all' }),
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

    const action = fetchRequestDistributionRequest(
      filters.year.value,
      selectedLibraryId,
      filters.institutionId.value,
      filters.countryId.value,
      filters.materialType.value,
    );
    dispatch(action);
  }, [dispatch, filters]);

  /**
   * Displayed data for charts - by status
   */
  let borrowing_data_byStatus = [];
  let lending_data_byStatus = [];
  if (data) {
    borrowing_data_byStatus = data.by_borrowing_status.map(item => ({
      Status: item.key,
      Count: item.count,
    }));

    lending_data_byStatus = data.by_lending_status.map(item => ({
      Status: item.key,
      Count: item.count,
    }));
  }

  /**
   * Displayed data for charts - by material type
   */
  let borrowing_data_byMaterialType = {};
  let lending_data_byMaterialType = {};
  if (data) {
    const borrowingMaterialTypeTotals = {};
    data.by_borrowing_status.forEach(status => {
      Object.entries(status.material_types).forEach(([typeId, count]) => {
        borrowingMaterialTypeTotals[typeId] =
          (borrowingMaterialTypeTotals[typeId] || 0) + count;
      });
      borrowing_data_byMaterialType = Object.entries(
        borrowingMaterialTypeTotals,
      ).map(([typeId, totalCount]) => ({
        label: getMaterialTypeLabel(typeId, intl),
        count: totalCount,
      }));
    });

    const lendingMaterialTypeTotals = {};
    data.by_lending_status.forEach(status => {
      Object.entries(status.material_types).forEach(([typeId, count]) => {
        lendingMaterialTypeTotals[typeId] =
          (lendingMaterialTypeTotals[typeId] || 0) + count;
      });
      lending_data_byMaterialType = Object.entries(
        lendingMaterialTypeTotals,
      ).map(([typeId, totalCount]) => ({
        label: getMaterialTypeLabel(typeId, intl),
        count: totalCount,
      }));
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>!!!Requests Distribution</h1>

      <FilterSelects
        roles={props.auth}
        filters={filters}
        setFilters={setFilters}
        libraries={libraryIdFromParams ? [] : librariesWithAll}
        institutions={libraryIdFromParams ? [] : institutionsWithAll}
        countries={libraryIdFromParams ? [] : countriesWithAll}
        onLibraryInput={handleLibraryInput}
        onInstitutionInput={handleInstitutionInput}
      />

      {data && (
        <>
          <h1>!!!BY STATUS</h1>
          <div className="charts-container">
            <div className="charts-box">
              <BarComponent
                title={intl.formatMessage({
                  id: 'app.stats.borrowingByStatus.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.borrowingByStatus.subtitle',
                  },
                  {
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={borrowing_data_byStatus.map(item => item.Status)}
                data={borrowing_data_byStatus.map(item => Number(item.Count))}
                datasetLabel="!!!Total requests"
              />
            </div>
            <div className="charts-box">
              <BarComponent
                title={intl.formatMessage({
                  id: 'app.stats.lendingByStatus.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.lendingByStatus.subtitle',
                  },
                  {
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={lending_data_byStatus.map(item => item.Status)}
                data={lending_data_byStatus.map(item => Number(item.Count))}
                datasetLabel="!!!Total requests"
              />
            </div>
          </div>
          <h1>!!!BY MATERIAL TYPE</h1>
          <div className="charts-container">
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.borrowingByMaterialType.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.borrowingByMaterialType.subtitle',
                  },
                  {
                    YEAR: filters.year.label,
                  },
                )}
                labels={
                  Array.isArray(borrowing_data_byMaterialType)
                    ? borrowing_data_byMaterialType.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(borrowing_data_byMaterialType)
                    ? borrowing_data_byMaterialType.map(item => item.count)
                    : []
                }
                datasetLabel="!!!Total requests"
              />
            </div>
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.lendingByMaterialType.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.lendingByMaterialType.subtitle',
                  },
                  {
                    YEAR: filters.year.label,
                  },
                )}
                labels={
                  Array.isArray(lending_data_byMaterialType)
                    ? lending_data_byMaterialType.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(lending_data_byMaterialType)
                    ? lending_data_byMaterialType.map(item => item.count)
                    : []
                }
                datasetLabel="!!!Total requests"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.stats.request_distribution,
  loading: state.stats.loading,
  error: state.stats.error,
  libraries: state.library.libraryOptionItemList,
  institutions: state.library.institutionsOptionList,
  countries: state.admin.countriesOptionList,
});

export default connect(mapStateToProps)(RequestsDistribution);
