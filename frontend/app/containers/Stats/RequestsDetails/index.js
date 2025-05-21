import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchRequestDistributionRequest } from '../actions';
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
import {
  getDeliveryMethodLabel,
  getReasonUnfilledLabel,
} from '../../../utils/stats';
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

    const action = fetchRequestDistributionRequest(
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
   * Displayed data for charts - by delivery method
   */
  let borrowing_data_total_received = 0;
  let lending_data_total_fulfilled = 0;
  let borrowing_data_delivery_method = [];
  let lending_data_delivery_method = [];

  if (data) {
    // Gets the total number of received requests
    borrowing_data_total_received =
      (data &&
        Array.isArray(data.by_borrowing_status) &&
        (
          data.by_borrowing_status.find(function(e) {
            return e.key === 'Received';
          }) || {}
        ).count) ||
      0;

    // Calculates the number of requests by delivery method
    borrowing_data_delivery_method = data.borrowing_fulfilled_distribution.map(
      item => ({
        label: getDeliveryMethodLabel(item.key, intl),
        count: item.count,
      }),
    );

    // Gets the total number of fulfilled requests
    lending_data_total_fulfilled =
      (data &&
        Array.isArray(data.by_lending_status) &&
        (
          data.by_lending_status.find(function(e) {
            return e.key === 'Fulfilled';
          }) || {}
        ).count) ||
      0;

    // Calculates the number of requests by delivery method
    lending_data_delivery_method = data.lending_fulfilled_distribution.map(
      item => ({
        label: getDeliveryMethodLabel(item.key, intl),
        count: item.count,
      }),
    );
  }

  /**
   * Display data for charts - by reason of unfillment
   */
  let borrowing_data_total_not_received = 0;
  let lending_data_total_not_fulfilled = 0;
  let borrowing_data_unfillment_reason = [];
  let lending_data_unfillment_reason = [];
  if (data) {
    // Gets the total number of not received requests
    borrowing_data_total_not_received =
      (data &&
        Array.isArray(data.by_borrowing_status) &&
        (
          data.by_borrowing_status.find(function(e) {
            return e.key === 'Not received';
          }) || {}
        ).count) ||
      0;

    // Calculates the number of requests by reason of unfillment
    borrowing_data_unfillment_reason = data.borrowing_unfilled_distribution.map(
      item => ({
        label: getReasonUnfilledLabel(item.key, intl),
        count: item.count,
      }),
    );

    // Gets the total number of not fulfilled requests
    lending_data_total_not_fulfilled =
      (data &&
        Array.isArray(data.by_lending_status) &&
        (
          data.by_lending_status.find(function(e) {
            return e.key === 'Not fulfilled';
          }) || {}
        ).count) ||
      0;

    // Calculates the number of requests by reason of unfillment
    lending_data_unfillment_reason = data.lending_unfilled_distribution.map(
      item => ({
        label: getReasonUnfilledLabel(item.key, intl),
        count: item.count,
      }),
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error || (!data)) return <div>{intl.formatMessage({ id: 'app.stats.notAvailable' })}</div>;

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'app.stats.requestsDetails.header' })}</h1>

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

      {data && (
        <>
          {/* <h1>!!!BORROWING</h1> */}
          <div className="charts-container">
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.borrowingByDeliveryMethod.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.borrowingByDeliveryMethod.subtitle',
                  },
                  {
                    TOTAL: borrowing_data_total_received,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={
                  Array.isArray(borrowing_data_delivery_method)
                    ? borrowing_data_delivery_method.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(borrowing_data_delivery_method)
                    ? borrowing_data_delivery_method.map(item => item.count)
                    : []
                }
              />
            </div>
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.lendingByDeliveryMethod.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.lendingByDeliveryMethod.subtitle',
                  },
                  {
                    TOTAL: lending_data_total_fulfilled,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={
                  Array.isArray(lending_data_delivery_method)
                    ? lending_data_delivery_method.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(lending_data_delivery_method)
                    ? lending_data_delivery_method.map(item => item.count)
                    : []
                }
              />
            </div>
          </div>
          {/* <h1>!!!LENDING</h1> */}
          <div className="charts-container">
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.borrowingByReasonUnfilled.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.borrowingByReasonUnfilled.subtitle',
                  },
                  {
                    TOTAL: borrowing_data_total_not_received,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={
                  Array.isArray(borrowing_data_unfillment_reason)
                    ? borrowing_data_unfillment_reason.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(borrowing_data_unfillment_reason)
                    ? borrowing_data_unfillment_reason.map(item => item.count)
                    : []
                }
              />
            </div>
            <div className="charts-box">
              <PieComponent
                title={intl.formatMessage({
                  id: 'app.stats.lendingByReasonUnfilled.title',
                })}
                subtitle={intl.formatMessage(
                  {
                    id: 'app.stats.lendingByReasonUnfilled.subtitle',
                  },
                  {
                    TOTAL: lending_data_total_not_fulfilled,
                    YEAR: filters.year.label,
                    MATERIAL_TYPE: filters.materialType.label,
                  },
                )}
                labels={
                  Array.isArray(lending_data_unfillment_reason)
                    ? lending_data_unfillment_reason.map(item => item.label)
                    : []
                }
                data={
                  Array.isArray(lending_data_unfillment_reason)
                    ? lending_data_unfillment_reason.map(item => item.count)
                    : []
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
  data: state.stats.request_distribution,
  loading: state.stats.loading,
  error: state.stats.error,
  libraries: state.library.libraryOptionItemList,
  institutions: state.library.institutionsOptionList,
  countries: state.admin.countriesOptionList,
});

export default connect(mapStateToProps)(RequestsDistribution);
