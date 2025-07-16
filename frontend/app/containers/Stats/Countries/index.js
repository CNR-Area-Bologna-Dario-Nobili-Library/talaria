import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchCountriesDistributionRequest } from '../actions';
import { useIntl } from 'react-intl';
import FilterSelects from '../../../components/Stats/FilterSelects';
import TableComponent from '../../../components/Stats/Table/TableComponent'
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

const Countries = props => {
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

    const action = fetchCountriesDistributionRequest(
      filters.year.value,
      filters.countryId.value,
      selectedLibraryId,
      filters.institutionId.value,
    );
    dispatch(action);
  }, [
    dispatch,
    filters.year.value,
    filters.libraryId.value,
    filters.institutionId.value,
    filters.countryId.value,
  ]);

  let tableData = [];
  let columns = [];

  if (data) {
    // Transform the data to have rows like this: 
    // [{name: 'Italy', requesting_from: 1, providing_to: 2}]
    const mergedCountriesMap = {};
  
    data.requesting_from.countries.forEach(({ name, count }) => {
      mergedCountriesMap[name] = { name, requesting_from: count, providing_to: 0 }; 
    });
  
    data.providing_to.countries.forEach(({ name, count }) => {
      if (!mergedCountriesMap[name]) {
        mergedCountriesMap[name] = { name, requesting_from: 0, providing_to: count };
      } else {
        mergedCountriesMap[name].providing_to = count;
      }
    });
  
    // Sort alphabetically by country name
    tableData = Object.values(mergedCountriesMap).sort((a, b) => a.name.localeCompare(b.name));

    columns = [
      { dataField: 'name', text: intl.formatMessage({ id: 'app.global.country' }) },
      { dataField: 'requesting_from', text: intl.formatMessage({ id: 'app.stats.country.requesting_from' }) },
      { dataField: 'providing_to', text: intl.formatMessage({ id: 'app.stats.country.providing_to' }) },
    ];
  }


  if(loading) return (
     <div>
       <div className='alert alert-warning'>{intl.formatMessage({ id: 'app.global.loading' })}</div>
       <Loader show={loading}/>
     </div>
   )
 

  if (error || (!data)) return <div>{intl.formatMessage({ id: 'app.stats.notAvailable' })}</div>;

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'app.stats.countries.header' })}</h1>
      <p style={{ whiteSpace: 'pre-line' }}>
        {intl.formatMessage({ id: 'app.stats.countries.description' })}
      </p>
      <p>
        {intl.formatMessage({ id: 'app.stats.filterYear' })}
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
      />

      {data && (
        <>
          <div className='charts-container'>
            <div className='charts-box'>
              <TableComponent
                data={tableData}
                headers={columns}
                // title={intl.formatMessage({ id: 'app.stats.countries.title' })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.stats.countries_distribution,
  loading: state.stats.loading,
  error: state.stats.error,
  libraries: state.library.libraryOptionItemList,
  institutions: state.library.institutionsOptionList,
  countries: state.admin.countriesOptionList,
});

export default connect(mapStateToProps)(Countries);