import React, { useState } from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';
import { checkRole } from '../../../utils/permissions';

const FilterSelects = ({
  roles = [],
  filters,
  setFilters,
  libraries = [],
  institutions = [],
  countries = [],
  onLibraryInput,
  onInstitutionInput,
}) => {
  const intl = useIntl();

  const [libraryInput, setLibraryInput] = useState('');
  const [institutionInput, setInstitutionInput] = useState('');

  const handleLibraryInputChange = input => {
    setLibraryInput(input);
    if (onLibraryInput) {
      onLibraryInput(input);
    }
  };

  const handleInstitutionInputChange = input => {
    setInstitutionInput(input);
    if (onInstitutionInput) {
      onInstitutionInput(input);
    }
  };

  // Generate years from env start to current
  const startYear = parseInt(process.env.SERVICE_YEAR_START);
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: intl.formatMessage({ id: 'app.stats.all' }), value: '' },
  ];
  for (let y = startYear; y <= currentYear; y++) {
    yearOptions.push({ label: y.toString(), value: y.toString() });
  }

  // Material types for selector
  const materialTypeOptions = [
    { label: intl.formatMessage({ id: 'app.stats.all' }), value: '' },
    { label: intl.formatMessage({ id: 'app.references.article' }), value: 1 },
    { label: intl.formatMessage({ id: 'app.references.book' }), value: 2 },
    { label: intl.formatMessage({ id: 'app.references.thesis' }), value: 3 },
    { label: intl.formatMessage({ id: 'app.references.cartography' }), value: 4 },
    { label: intl.formatMessage({ id: 'app.references.manuscript' }), value: 5 },
  ];

  const hasFullAccess = checkRole(roles, ['super-admin', 'manager']);

  const handleChange = field => selected => {
    setFilters(prev => ({
      ...prev,
      [field]: selected || {
        value: '',
        label: intl.formatMessage({ id: 'app.stats.all' }),
      },
    }));
  };

  const isLibrarySelected = filters.libraryId && filters.libraryId.value !== '';
  const isInstitutionSelected =
    filters.institutionId && filters.institutionId.value !== '';
  const isCountrySelected = filters.countryId && filters.countryId.value !== '';

  const libraryDisabled = isInstitutionSelected || isCountrySelected;
  const institutionDisabled = isLibrarySelected || isCountrySelected;
  const countryDisabled = isLibrarySelected || isInstitutionSelected;

  return (
    <>
      <div>
        <label htmlFor="year">
          {intl.formatMessage({ id: 'app.stats.year' })}
        </label>
        <Select
          inputId="year"
          options={yearOptions}
          onChange={handleChange('year')}
          value={filters.year}
        />
      </div>
      <div>
        <label htmlFor="materialType">
          {intl.formatMessage({ id: 'app.references.material_type' })}
        </label>
        <Select
          inputId="materialType"
          options={materialTypeOptions}
          onChange={handleChange('materialType')}
          value={filters.materialType}
        />
      </div>

      {hasFullAccess &&
        libraries.length > 0 &&
        institutions.length > 0 &&
        countries.length > 0 && (
          <>
            <div>
              <label htmlFor="libraryId">
                {intl.formatMessage({ id: 'app.global.library' })}
              </label>
              <Select
                inputId="libraryId"
                options={libraries}
                value={filters.libraryId}
                onChange={handleChange('libraryId')}
                onInputChange={handleLibraryInputChange}
                isDisabled={libraryDisabled}
              />
            </div>
            <div>
              <label htmlFor="institutionId">
                {intl.formatMessage({ id: 'app.libraries.institution_id' })}
              </label>
              <Select
                inputId="institutionId"
                options={institutions}
                value={filters.institutionId}
                onChange={handleChange('institutionId')}
                onInputChange={handleInstitutionInputChange}
                isDisabled={institutionDisabled}
              />
            </div>
            <div>
              <label htmlFor="countryId">
                {intl.formatMessage({ id: 'app.global.country' })}
              </label>
              <Select
                inputId="countryId"
                options={countries}
                value={filters.countryId}
                onChange={handleChange('countryId')}
                isDisabled={countryDisabled}
              />
            </div>
          </>
        )}
    </>
  );
};

export default FilterSelects;
