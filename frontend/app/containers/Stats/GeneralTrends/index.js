import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchRequestDistributionRequest } from '../actions';
import { useIntl } from 'react-intl';
import FilterSelects from '../../../components/Stats/FilterSelects';
import GroupedBarComponent from '../../../components/Stats/Charts/GroupedBarComponent';
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
import Loader from '../../../components/Form/Loader';

const GeneralTrends = props => {
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

  // State for yearly data
  const [yearlyData, setYearlyData] = useState({});

  const allOption = {
    label: intl.formatMessage({ id: 'app.global.all' }),
    value: '',
  };

  // Filters for the API call
  const [filters, setFilters] = useState({
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

  // Array of years
  const serviceYears = [];

  // Loop from process.env.SERVICE_YEAR_START to current year
  const currentYear = new Date().getFullYear();
  for (let i = parseInt(process.env.SERVICE_YEAR_START); i <= currentYear; i++) {
    serviceYears.push(i);
  }

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

    serviceYears.forEach(year => {
      const action = fetchRequestDistributionRequest(
        year,
        selectedLibraryId,
        filters.institutionId.value,
        filters.countryId.value,
      );
      console.log('action', action);
      dispatch(action);
    });
  }, [
    dispatch,
    filters.libraryId.value,
    filters.institutionId.value,
    filters.countryId.value,
  ]);

  /**
   * Store data when it changes
   */
  useEffect(() => {
    if (!data || data.year == "") {
      return;
    }

    setYearlyData(prev => ({
      ...prev,
      [data.year]: {
        borrowing: data.by_borrowing_status,
        lending: data.by_lending_status,
      },
    }));
  }, [data]);

  /**
   * Displayed data for charts - by year
   */
  const yearlyDataByYear = Object.values(yearlyData);

  const allYearsBorrowing = yearlyDataByYear.map(item => item.borrowing);
  const borrowing_totalCountsByYear = [];
  const borrowing_receivedCountsByYear = [];
  
  const allYearsLending = yearlyDataByYear.map(item => item.lending);
  const lending_totalCountsByYear = [];
  const lending_fulfilledCountsByYear = [];

  allYearsBorrowing.forEach(statuses => {
    let total = 0;
    let received = 0;
    statuses.forEach(element => {
      total += element.count;
      if (element.key === 'Received') {
        received = element.count;
      }
    });

    borrowing_totalCountsByYear.push(total);
    borrowing_receivedCountsByYear.push(received);
  })

  allYearsLending.forEach(statuses => {
    let total = 0;
    let fulfilled = 0;
    statuses.forEach(element => {
      total += element.count;
      if (element.key === 'Fulfilled') {
        fulfilled = element.count;
      }
    });

    lending_totalCountsByYear.push(total);
    lending_fulfilledCountsByYear.push(fulfilled);
  })

  // Borrowing dataset
  const borrowingDatasets = [
    { key: 'borrowing_total', label: intl.formatMessage({ id: 'app.stats.borrowingGeneralTrends.total' }), data: borrowing_totalCountsByYear },
    { key: 'received', label: intl.formatMessage({ id: 'app.stats.borrowingGeneralTrends.received' }), data: borrowing_receivedCountsByYear },
  ];

  // Lending dataset
  const lendingDatasets = [
    { key: 'lending_total', label: intl.formatMessage({ id: 'app.stats.lendingGeneralTrends.total' }), data: lending_totalCountsByYear },
    { key: 'fulfilled', label: intl.formatMessage({ id: 'app.stats.lendingGeneralTrends.fulfilled' }), data: lending_fulfilledCountsByYear },
  ];

  if (loading) {
    return (
      <div>
        <div className='alert alert-warning'>{intl.formatMessage({ id: 'app.global.loading' })}</div>
        <Loader show={loading}/>
      </div>
    )
  }

  if (error || (!data)) return <div>{intl.formatMessage({ id: 'app.stats.notAvailable' })}</div>;

  return (
    <div>
      <h1>
        {intl.formatMessage({ id: 'app.stats.homepage.header' })}
      </h1>
      <p style={{ whiteSpace: 'pre-line' }}>
        {intl.formatMessage({ id: 'app.stats.homepage.content' })}
      </p>
      <p>
        {intl.formatMessage({ id: 'app.stats.export' })}
      </p>

      <FilterSelects
        filters={filters}
        setFilters={setFilters}
        libraries={libraryIdFromParams ? [] : librariesWithAll}
        institutions={libraryIdFromParams ? [] : institutionsWithAll}
        countries={libraryIdFromParams ? [] : countriesWithAll}
        onLibraryInput={handleLibraryInput}
        onInstitutionInput={handleInstitutionInput}
        hasFullAccess={hasFullAccess}
        showMaterialType={false}
        showYear={false}
      />

      {data && (
        <>
          <div className="charts-container">
            <div className="charts-box">
              <GroupedBarComponent
                title={intl.formatMessage({
                  id: 'app.stats.borrowingGeneralTrends.title',
                })}
                labels={serviceYears}
                datasets={borrowingDatasets}
              />
            </div>
            <div className="charts-box">
              <GroupedBarComponent
                title={intl.formatMessage({
                  id: 'app.stats.lendingGeneralTrends.title',
                })}
                labels={serviceYears}
                datasets={lendingDatasets}
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

export default connect(mapStateToProps)(GeneralTrends);
