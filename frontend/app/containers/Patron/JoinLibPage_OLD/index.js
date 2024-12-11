import React, { useEffect, useState, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useIntl } from 'react-intl';
import makeSelectLibrary from 'containers/Library/selectors';
import {
  requestUser,
  requestAccessToLibrary,
  requestUpdateAccessToLibrary,
  requestGetTitlesOptionList,
  requestLibraryOptionList,
  requestMyLibraries,
  requestGetLibrary,
} from '../actions';
import BelongingLibraries from '../BelongingLibraries';
import {
  placesSelector,
  librariesSelector,
  titlesSelector,
  libraryListSelector,
} from '../selectors';
import Select from 'react-select';
import makeSelectPatron, { isPatronLoading } from '../selectors';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import messages from './messages';
import history from 'utils/history';

function JoinLibPage(props) {
  const intl = useIntl();
  const { auth, dispatch, isLoading, patron, match } = props;
  const { params } = match;
  const isNew = !params || !params.id || params.id === 'new';
  const departments = props.library.departmentOptionList || [];
  const titles = props.titles || [];
  const libraries = props.libraries || [];
  const [showForm, setShowForm] = useState(false);
  const [libraryId, setLibraryId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([34.0522, -118.2437]); // Default to Los Angeles
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(requestLibraryOptionList());
    dispatch(requestGetTitlesOptionList());
    dispatch(requestMyLibraries());
    if (params && params.library_id) {
      dispatch(requestGetLibrary(params.library_id, 'departments'));
      if (!isNew) {
        dispatch(requestUser(params.library_id, params.id));
      }
    }
  }, [dispatch, params]);

  
  const options = libraries.map(library => ({
    value: library.value,
    label: library.label,
    isDisabled: patron.my_libraries.data.some(
      item => item.library_id === library.value,
    ),
  }));

  const selectedOptionIndex = options.findIndex(
    option => option.value === parseInt(params.library_id, 10),
  );
  const selectedValueAll =
    selectedOptionIndex !== -1 ? options[selectedOptionIndex] : null;

  const handleLibraryChange = selectedOption => {
    setLibraryId(selectedOption ? selectedOption.value : null);
    setSelectedValue(selectedOption);

    if (selectedOption) {
      const selectedLibraryInfo = libraries.find(
        (library) => library.value === selectedOption.value
      );
      // const newCenter = [
      //   parseFloat(selectedLibraryInfo.lat),
      //   parseFloat(selectedLibraryInfo.lon),
      // ];
      // setMapCenter(newCenter);
      // setShowMap(true);

      // if (mapRef.current) {
      //   mapRef.current.setView(newCenter, 12, { animate: true, duration: 1.5 });
      // }
    }
  };

  const toggleMap = () => setShowMap(!showMap);

  const isSubmitDisabled = !libraryId; 

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    if (isNew) {
      dispatch(
        requestAccessToLibrary({
          ...data,
          user_id: props.auth.user.id,
          library_id: libraryId,
        }),
      );
    } else {
      dispatch(
        requestUpdateAccessToLibrary({
          ...data,
          library_id: params.library_id,
          id: params.id,
        }),
      );
    }
  };

  const filterLibraries = (option, inputValue) => {
    if (inputValue.length < 3) return false;
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  const MapLibraries = Array.isArray(libraries)
    ? libraries.map((library) => ({
        id: library.value,
        name: library.label,
        latitude: parseFloat(library.lat),
        longitude: parseFloat(library.lon),
      }))
    : [];

  return (
    <>
     

      {showForm && (
        <div className="card mt-4">
          <div className="card-body">
            <div className="container text-center mt-5">
              <h1 className="card-body-header">
                {intl.formatMessage(messages.areYouPatron)}
              </h1>
              <p className="card-body-subheader">
                {intl.formatMessage(messages.searchLibrary)}
              </p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div style={{ flex: 1, marginRight: '20px' }}>
                <Select
                  name="library_id"
                  id="library_id"
                  aria-label="Library selection dropdown"
                  classNamePrefix="select-container"
                  options={options}
                  onChange={handleLibraryChange}
                  filterOption={filterLibraries}
                  value={selectedValueAll || selectedValue}
                  placeholder="Select a library…"
                  isSearchable
                  required
                />
              </div>

              
              {/* <div style={{ cursor: 'pointer', fontSize: '24px' }}>
                <i
                  className="fa fa-map-marker-alt"
                  onClick={toggleMap}
                  aria-label="Toggle map"
                />
              </div>  */}
            </div>

            
            {showMap && (
              <div style={{ marginTop: '20px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: '400px', width: '100%' }}
                  whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                    if (selectedValue) {
                      mapInstance.setView(
                        mapCenter,
                        12,
                        { animate: true, duration: 1.5 }
                      );
                    }
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {MapLibraries.map((library) => (
                    <Marker
                      key={library.id}
                      position={[library.latitude, library.longitude]}
                      eventHandlers={{
                        click: () => {
                          handleLibraryChange({
                            value: library.id,
                            label: library.name,
                          });
                          setShowMap(false); // Hide the map after selection
                        },
                      }}
                    >
                      <Popup>
                        {library.name} <br /> Latitude: {library.latitude}, Longitude: {library.longitude}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )} 

            {selectedValue && (
              <form onSubmit={handleSubmit} className="container mt-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h4>
                      <strong>{intl.formatMessage(messages.assignLibraryLabel)}</strong>
                    </h4>
                    <label htmlFor="label">
                      {intl.formatMessage(messages.defineLibraryLabel)}
                    </label>
                    <input
                      type="text"
                      id="label"
                      name="label"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h4>
                      <strong>{intl.formatMessage(messages.defineLibraryData)}</strong>
                    </h4>
                    <div className="row mt-2">
                      {auth.permissions.roles &&
                        auth.permissions.roles.includes('patron') && (
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="department_id">Department</label>
                              <Select
                                name="department_id"
                                id="department_id"
                                options={departments.map(dept => ({
                                  value: dept.value,
                                  label: dept.label,
                                }))}
                              />
                            </div>
                          </div>
                        )}

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="titleId">Title</label>
                          <Select
                            name="title_id"
                            id="title_id"
                            options={titles.map(title => ({
                              value: title.value,
                              label: title.label,
                            }))}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="userReferent">
                            {intl.formatMessage(messages.user_referent)}
                          </label>
                          <input
                            type="text"
                            id="userReferent"
                            name="user_referent"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="user_mat">
                            {intl.formatMessage(messages.user_mat)}
                          </label>
                          <input
                            type="text"
                            id="user_mat"
                            name="user_mat"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="user_service_phone">
                            {intl.formatMessage(messages.user_service_phone)}
                          </label>
                          <input
                            type="tel"
                            id="user_service_phone"
                            name="user_service_phone"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="user_service_email">
                            {intl.formatMessage(messages.user_service_email)}
                          </label>
                          <input
                            type="email"
                            id="user_service_email"
                            name="user_service_email"
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitDisabled}
                  >
                    {isNew ? 'Join as a Patron' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  places: placesSelector(),
  titles: titlesSelector(),
  libraries: librariesSelector(),
  patron: makeSelectPatron(),
  isLoading: isPatronLoading(),
  libraryList: libraryListSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(JoinLibPage);
