import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const MyLibraryForm = props => {
  const {
    isNew,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    isSubmitting,
    departments,
    titles,
    selectedValue,
    handleLibraryChange,
    handleSearchInputChange,
    filteredOptions,
    errorMessage,
    intl,
    messages,
  } = props;

  // State to track if a library is selected
  const [isLibrarySelected, setIsLibrarySelected] = useState(false);

  useEffect(() => {
    // Enable fields if in edit mode or a library is already selected
    if (!isNew || selectedValue) {
      setIsLibrarySelected(true);
    }
  }, [isNew, selectedValue]);

  const onLibraryChange = selectedOption => {
    handleLibraryChange(selectedOption);
    setIsLibrarySelected(!!selectedOption); // Enable fields if a library is selected
  };

  return (
    <>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="container mt-3">
        <div className="mb-4">
          <h1>{isNew ? 'Join Library' : 'Edit Library'}</h1>
          <p>
            Fill in the details below to {isNew ? 'join' : 'edit'} the library.
          </p>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <label htmlFor="library_id">
              {intl.formatMessage(messages.name)}
            </label>
            <div className="d-flex align-items-center">
              <div style={{ flex: 1 }}>
                <Select
                  name="library_id"
                  id="library_id"
                  styles={{
                    container: provided => ({ ...provided, width: '100%' }),
                  }}
                  options={isNew ? filteredOptions : []}
                  onChange={onLibraryChange}
                  onInputChange={handleSearchInputChange}
                  value={selectedValue}
                  isSearchable
                  placeholder="Search and select a library"
                  required
                  isDisabled={!isNew} // Disable only in edit mode if not needed
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fieldset to disable all form elements at once */}
        <fieldset disabled={!isLibrarySelected && isNew && !isSubmitting}>
          <div className="card mb-4">
            <div className="card-body">
              <h4>{intl.formatMessage(messages.library_details)}</h4>

              <div className="form-group">
                <label htmlFor="label">
                  {intl.formatMessage(messages.label)}
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department_id">
                  {intl.formatMessage(messages.department_id)}
                </label>
                <Select
                  name="department_id"
                  id="department_id"
                  options={departments.map(dept => ({
                    value: dept.value,
                    label: dept.label,
                  }))}
                  value={departments.find(
                    dept => dept.value === formData.department_id,
                  )}
                  onChange={selectedOption =>
                    handleSelectChange('department_id', selectedOption)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="title_id">
                  {intl.formatMessage(messages.title_id)}
                </label>
                <Select
                  name="title_id"
                  id="title_id"
                  options={titles.map(title => ({
                    value: title.value,
                    label: title.label,
                  }))}
                  value={titles.find(
                    title => title.value === formData.title_id,
                  )}
                  onChange={selectedOption =>
                    handleSelectChange('title_id', selectedOption)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_referent">
                  {intl.formatMessage(messages.user_referent)}
                </label>
                <input
                  type="text"
                  id="user_referent"
                  name="user_referent"
                  value={formData.user_referent}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_mat">
                  {intl.formatMessage(messages.user_mat)}
                </label>
                <input
                  type="text"
                  id="user_mat"
                  name="user_mat"
                  value={formData.user_mat}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_service_phone">
                  {intl.formatMessage(messages.user_service_phone)}
                </label>
                <input
                  type="text"
                  id="user_service_phone"
                  name="user_service_phone"
                  value={formData.user_service_phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_service_email">
                  {intl.formatMessage(messages.user_service_email)}
                </label>
                <input
                  type="email"
                  id="user_service_email"
                  name="user_service_email"
                  value={formData.user_service_email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || (!isLibrarySelected && isNew)}
          >
            {isNew ? 'Join as a Patron' : 'Update'}
          </button>
        </div>
      </form>
    </>
  );
};

MyLibraryForm.propTypes = {
  isNew: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  departments: PropTypes.array.isRequired,
  titles: PropTypes.array.isRequired,
  selectedValue: PropTypes.object,
  handleLibraryChange: PropTypes.func.isRequired,
  handleSearchInputChange: PropTypes.func.isRequired,
  filteredOptions: PropTypes.array.isRequired,
  errorMessage: PropTypes.string,
  intl: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
};

export default MyLibraryForm;
