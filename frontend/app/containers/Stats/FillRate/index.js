import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchFillRateRequest } from '../actions';
import { useIntl } from 'react-intl';
import FilterSelects from '../../../components/Stats/FilterSelects';
import PieComponent from '../../../components/Stats/Charts/PieComponent';
import { requestGetCountriesOptionList } from '../../../containers/Admin/actions';
import {
  requestLibraryOptionList,
  requestGetInstitutionsOptionList,
  requestClearLibraryOptionList,
  requestClearInstitutionsOptionList,
} from '../../Library/actions';
import { checkRole } from '../../../utils/permissions';
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

    const action = fetchFillRateRequest(
      filters.year.value,
      selectedLibraryId,
      filters.institutionId.value,
      filters.countryId.value,
      filters.materialType.value,
    );
    dispatch(action);
  }, [
    dispatch,
    filters.year.value,
    filters.libraryId.value,
    filters.institutionId.value,
    filters.countryId.value,
    filters.materialType.value,
  ]);

  /**
   * Displayed data for charts - borrowing fillrate
   */
  let borrowing_fillrate = {};
  if (data) {
    borrowing_fillrate = [
      {
        label: intl.formatMessage({ id: 'app.stats.fillRate.borrowing' }),
        value: data.borrowing_fill_rate.toFixed(2),
      },
      {
        label: intl.formatMessage({ id: 'app.stats.unFillRate.borrowing' }),
        value: data.borrowing_unfill_rate.toFixed(2),
      },
    ];
  }

  /**
   * Display data for charts - lending fillrate
   */
  let lending_fillrate = {};
  if (data) {
    lending_fillrate = [
      {
        label: intl.formatMessage({ id: 'app.stats.fillRate.lending' }),
        value: data.lending_fill_rate.toFixed(2),
      },
      {
        label: intl.formatMessage({ id: 'app.stats.unFillRate.lending' }),
        value: data.lending_unfill_rate.toFixed(2),
      },
    ];
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'app.stats.fillRate.header' })}</h1>

      <FilterSelects
        roles={props.auth}
        filters={filters}
        setFilters={setFilters}
        libraries={libraryIdFromParams ? [] : librariesWithAll}
        institutions={libraryIdFromParams ? [] : institutionsWithAll}
        countries={libraryIdFromParams ? [] : countriesWithAll}
        onLibraryInput={handleLibraryInput}
        onInstitutionInput={handleInstitutionInput}
        showMaterialType={false}
        hasFullAccess={hasFullAccess}
      />

      {data && (
        <>
          <div className="charts-container">
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.fillRate.borrowing.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.fillRate.borrowing.subtitle',
                  },
                  {
                    TOTAL: data.total_borrowing,
                    YEAR: filters.year.label,
                  },
                )}
                labels={
                  Array.isArray(borrowing_fillrate)
                    ? borrowing_fillrate.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(borrowing_fillrate)
                    ? borrowing_fillrate.map(item => item.value)
                    : []
                }
                tooltipLabelFormatter={context =>
                  `${context.label}: ${context.raw}%`
                }
              />
            </div>
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.fillRate.lending.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.fillRate.lending.subtitle',
                  },
                  {
                    TOTAL: data.total_lending,
                    YEAR: filters.year.label,
                  },
                )}
                labels={
                  Array.isArray(lending_fillrate)
                    ? lending_fillrate.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(lending_fillrate)
                    ? lending_fillrate.map(item => item.value)
                    : []
                }
                tooltipLabelFormatter={context =>
                  `${context.label}: ${context.raw}%`
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.stats.fill_rate,
  loading: state.stats.loading,
  error: state.stats.error,
  libraries: state.library.libraryOptionItemList,
  institutions: state.library.institutionsOptionList,
  countries: state.admin.countriesOptionList,
});

export default connect(mapStateToProps)(RequestsDistribution);
