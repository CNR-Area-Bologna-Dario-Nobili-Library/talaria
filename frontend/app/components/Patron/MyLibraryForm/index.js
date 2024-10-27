import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

  // Combine the state into a single object to prevent state conflicts
  const [formState, setFormState] = useState({
    isLibrarySelected: false,
    selectedLibrary: null,
    mapKey: 0,
  });

  // Initialize form state on mount
  useEffect(() => {
    if (!isNew && selectedValue) {
      const libraryInfo = filteredOptions.find(
        library => library.value === selectedValue.value,
      );
      if (libraryInfo) {
        setFormState(prev => ({
          ...prev,
          isLibrarySelected: true,
          selectedLibrary: libraryInfo,
        }));
      }
    }
  }, []); // Empty dependency array for initialization

  // Update form state when selectedValue changes
  useEffect(() => {
    if (selectedValue) {
      const libraryInfo = filteredOptions.find(
        library => library.value === selectedValue.value,
      );
      if (libraryInfo) {
        setFormState(prev => ({
          ...prev,
          isLibrarySelected: true,
          selectedLibrary: libraryInfo,
          mapKey: prev.mapKey + 1,
        }));
      }
    }
  }, [selectedValue, filteredOptions]);

  // Handle library selection
  const onLibraryChange = selectedOption => {
    handleLibraryChange(selectedOption);

    if (selectedOption) {
      const libraryInfo = filteredOptions.find(
        library => library.value === selectedOption.value,
      );
      if (libraryInfo) {
        setFormState(prev => ({
          ...prev,
          isLibrarySelected: true,
          selectedLibrary: libraryInfo,
          mapKey: prev.mapKey + 1,
        }));
      }
    } else {
      setFormState(prev => ({
        ...prev,
        isLibrarySelected: false,
        selectedLibrary: null,
      }));
    }
  };

  const renderMap = (latitude, longitude, libraryLabel) => {
    return (
      <MapContainer
        key={formState.mapKey}
        center={[latitude, longitude]}
        zoom={12}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            {libraryLabel} <br />
            Latitude: {latitude}, Longitude: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    );
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
          {!isNew && <span className="badge bg-secondary">Edit Mode</span>}
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
                  isDisabled={!isNew}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Library Information Display */}
        {formState.selectedLibrary && (
          <div className="card mb-4">
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <th className="text-end" style={{ width: '30%' }}>
                      Address:
                    </th>
                    <td>{formState.selectedLibrary.address || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th className="text-end" style={{ width: '30%' }}>
                      Email ILL Service:
                    </th>
                    <td>{formState.selectedLibrary.email || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Map Display */}
              {(() => {
                const latitude = parseFloat(formState.selectedLibrary.lat);
                const longitude = parseFloat(formState.selectedLibrary.lon);
                const hasValidCoordinates =
                  !isNaN(latitude) &&
                  !isNaN(longitude) &&
                  latitude >= -90 &&
                  latitude <= 90 &&
                  longitude >= -180 &&
                  longitude <= 180;

                return hasValidCoordinates ? (
                  <div className="mt-4">
                    {/* <h5 className="card-title">Location Map</h5> */}
                    {renderMap(
                      latitude,
                      longitude,
                      formState.selectedLibrary.label,
                    )}
                  </div>
                ) : (
                  <div className="alert alert-danger mt-4" role="alert">
                    Unable to display map: Invalid or missing coordinates.
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Form Fields */}
        <fieldset
          disabled={!formState.isLibrarySelected && isNew && !isSubmitting}
        >
          <div className="card mb-4">
            <div className="card-body">
              <h4>{intl.formatMessage(messages.library_details)}</h4>

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-3">
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
            disabled={isSubmitting || (!formState.isLibrarySelected && isNew)}
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
