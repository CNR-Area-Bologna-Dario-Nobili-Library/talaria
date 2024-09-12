import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import { useIntl } from 'react-intl';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import messages from './messages';
import L from 'leaflet';
import './style.scss';
import { permissionBadgeClass } from '../../utils/utilityFunctions.js';
import { formatDateTime } from '../../utils/dates';

const LandingPageLibrariesBox = props => {
  const { auth, title, libraryList, history, canCollapse, collapsed } = props;
  const [libraryId, setLibraryId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showRegisterOption, setShowRegisterOption] = useState(false);
  const [showLibrarianPrompt, setShowLibrarianPrompt] = useState(false);
  const [showMap, setShowMap] = useState(false); // Hide the map by default
  const [mapCenter, setMapCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const intl = useIntl();
  const libraries = libraryList || [];

  const fromOpenURLorPubmed =
    history &&
    history.location &&
    history.location.search.includes('byopenurl');

  // Calculate the distance between two coordinates (in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', { latitude, longitude });
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]); // Center the map on user's location
        },
        error => {
          console.error('Geolocation error:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              showMap &&
                setLocationError('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              setLocationError('An unknown error occurred.');
              break;
            default:
              setLocationError(
                'An error occurred while retrieving your location.',
              );
          }
        },
        { timeout: 10000 }, // Timeout after 10 seconds
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleLibraryChange = selectedOption => {
    setLocationError(null); // Reset any previous error message

    if (selectedOption) {
      const selectedLibraryInfo = libraries.find(
        library => library.value === selectedOption.value,
      );
      
      setLibraryId(selectedOption.value);
      setSelectedValue(selectedOption);
      setSelectedLibrary(selectedLibraryInfo);

      if (selectedLibraryInfo) {
        // Ensure that lat and lon exist and are valid numbers
        const lat = selectedLibraryInfo.lat ? parseFloat(selectedLibraryInfo.lat) : NaN;
        const lon = selectedLibraryInfo.lon ? parseFloat(selectedLibraryInfo.lon) : NaN;

        // Check if both lat and lon are valid numbers (not NaN) and within valid geographical range
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          const newCenter = [lat, lon];
          setMapCenter(newCenter);
          setShowMap(true); // Show the map when valid coordinates are available

          // If the map is already created, animate the center change
          if (mapRef.current) {
            mapRef.current.setView(newCenter, 12, {
              animate: true,
              duration: 1.5,
            });
          }

          setLocationError(null); // Clear any error message
        } else {
          // If lat/lon are missing, invalid, or out of range, hide the map and show an error message
          setShowMap(false); // Hide the map
          setLocationError("Invalid or unavailable longitude and latitude for the selected library."); // Display error message
        }
      } else {
        // Handle case where no valid library information is found
        setShowMap(false); // Hide the map
        setLocationError("Library information not found.");
      }

      setShowRegisterOption(false);
      setShowLibrarianPrompt(false);

    } else {
      // Reset values if no library is selected
      setLibraryId(null);
      setSelectedValue(null);
      setSelectedLibrary(null);
      setShowMap(false); // Hide the map
      setLocationError(null); // Clear any error message
      setShowRegisterOption(false);
    }
  };


  const handleReset = () => {
    setLibraryId(null);
    setSelectedValue(null);
    setSelectedLibrary(null);
    setShowRegisterOption(true);
    setShowLibrarianPrompt(true);
    setShowMap(false); // Hide the map on reset
  };

  // Toggle map display
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Custom filter function to only start searching after 3 characters
  const filterLibraries = (option, inputValue) => {
    if (inputValue.length < 3) return false; // Only search when 3 or more characters are typed
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  const validLibraries = Array.isArray(libraries)
 ? libraries.filter(
     library =>
       !isNaN(parseFloat(library.lat)) && // Ensure latitude is a valid number
       !isNaN(parseFloat(library.lon)) && // Ensure longitude is a valid number
       parseFloat(library.lat) >= -90 && // Latitude within range
       parseFloat(library.lat) <= 90 && // Latitude within range
       parseFloat(library.lon) >= -180 && // Longitude within range
       parseFloat(library.lon) <= 180 // Longitude within range
   ).map(library => ({
     id: library.value,
     name: library.label,
     latitude: parseFloat(library.lat), // Parse valid latitude
     longitude: parseFloat(library.lon), // Parse valid longitude
   }))
 : [];


  const statusClass = status => {
    switch (status) {
      case 0:
        return 'pending';
      case 2:
        return 'disabled';
      default:
        return status;
    }
  };

  return (
    <LandingPageBox
      iconClass="fa-solid fa-landmark"
      title={title}
      canCollapse={canCollapse}
      collapsed={collapsed}
    >
      <>
        {/* Display the two tables first */}
        {auth.permissions.resources.libraries &&
          auth.permissions.resources.libraries.length >= 1 && (
            <div className="container">
              <h3 className="text-center mb-4">Current Permissions</h3>
              <div className="div-responsive">
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                    {intl.formatMessage({id: 'app.global.library',})}
                    </div>
                    <div className="div-table-header" style={{ width: '42%' }}>
                    {intl.formatMessage({id: 'app.global.permissions',})}
                    </div>
                    <div
                      className="div-table-header"
                      style={{ width: '33%', textAlign: 'center' }}
                    >
                     {intl.formatMessage({id: 'app.global.actions',})}
                    </div>
                  </div>
                  {auth.permissions.resources.libraries.map((res, i) => (
                    <div className="div-table-row" key={`row-${i}`}>
                      <div className="div-table-cell">{res.resource.name}</div>
                      <div className="div-table-cell">
                        {res.permissions.map((p, index) => (
                          <span
                            key={`badge_perm_${index}`}
                            className={`badge ${permissionBadgeClass(p)}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <div className="div-table-cell d-flex justify-content-center align-items-center">
                        <div className="div-current-actions text-center">
                          <Link
                            className="btn btn-sm btn-primary mb-2"
                            to={'/library/' + res.resource.id}
                            key={'lib' + res.resource.id}
                          >
                            Visit This Library
                          </Link>
                          {(res.permissions.includes('borrow') ||
                            res.permissions.includes('manage')) && (
                            <>
                              {fromOpenURLorPubmed && (
                                <Link
                                  className="btn btn-sm btn-success mb-2"
                                  to={
                                    '/library/' +
                                    res.resource.id +
                                    '/borrowing/new' +
                                    (history.location.search
                                      ? history.location.search
                                      : '')
                                  }
                                  key={'openurllink' + res.resource.id}
                                >
                                  Import from Openurl/Pubmed
                                </Link>
                              )}
                              {!fromOpenURLorPubmed && (
                                <Link
                                  className="btn btn-sm btn-info mb-2"
                                  to={
                                    '/library/' +
                                    res.resource.id +
                                    '/borrowing/new'
                                  }
                                  key={'borrlink' + res.resource.id}
                                >
                                  New request
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        <br />
        <br />
        {auth.permissions.tempresources &&
          auth.permissions.tempresources.libraries &&
          auth.permissions.tempresources.libraries.filter(
            res => res.status === 0 || res.status === 2,
          ).length > 0 && (
            <div className="container">
              <h3 className="text-center mb-4">Pending/Rejected Requests</h3>
              <div className="div-responsive">
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                    {intl.formatMessage({id: 'app.global.library',})}
                    </div>
                    <div className="div-table-header" style={{ width: '19%' }}>
                    {intl.formatMessage({id: 'app.global.permissions',})}
                    </div>
                    <div className="div-table-header" style={{ width: '10%' }}>
                    {intl.formatMessage({id: 'app.global.status',})}
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                    {intl.formatMessage({id: 'app.global.created_at',})}
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                    {intl.formatMessage({id: 'app.global.updated_at',})}
                    </div>
                    <div className="div-table-header" style={{ width: '20%' }}>
                      {intl.formatMessage({id: 'app.global.actions',})}

                    </div>
                  </div>
                  {auth.permissions.tempresources.libraries
                    .filter(res => res.status === 0 || res.status === 2) // Filter the libraries with status 0 or status 2
                    .map((res, i) => (
                      <div className="div-table-row" key={`pendrow-${i}`}>
                        <div className="div-table-cell">
                          {res.resource.name}
                        </div>
                        <div className="div-table-cell">
                          {res.permissions.map((p, index) => (
                            <span
                              key={`badge_temp_perm_${index}`}
                              className={`badge ${permissionBadgeClass(p)}`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="div-table-cell">
                          <div
                            className={`status-point ${statusClass(
                              res.status,
                            )}`}
                          />
                        </div>
                        <div className="div-table-cell">
                          {formatDateTime(res.created_at)}
                        </div>
                        <div className="div-table-cell">
                          {formatDateTime(res.updated_at)}
                        </div>
                        <div className="div-table-cell">
                          {res.status === 2 ? (
                            <div>No Actions, Request Rejected</div>
                          ) : (
                            <div className="div-actions">
                              <a
                                className="btn btn-success btn-sm"
                                href="#"
                                onClick={() => props.onAccept(res.id)}
                              >
                                 {intl.formatMessage({id: 'app.global.accept',})}
                              </a>
                              <a
                                className="btn btn-danger btn-sm"
                                href="#"
                                onClick={() => props.onReject(res.id)}
                              >
                                 {intl.formatMessage({id: 'app.global.reject',})}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        {/* Add the hr separator */}
        <hr className="my-5" />

        {/* Are you a Librarian? section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="container text-center mt-5">
              <h1 className="card-body-header">
                {intl.formatMessage(messages.AreYouLibrarian)}
              </h1>
              <p className="card-body-subheader">
                {intl.formatMessage(messages.RegisterLibraryCommunity)}
              </p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div style={{ flex: 1, marginRight: '20px' }}>
                <Select
                  name="library_id"
                  id="library_id"
                  aria-label="Library selection dropdown"
                  classNamePrefix="select-container"
                  options={libraries}
                  onChange={handleLibraryChange}
                  filterOption={filterLibraries} // Apply custom filter logic
                  value={selectedValue}
                  placeholder="Select a library…"
                  isSearchable
                  required
                />
              </div>

              {/* Map Toggle Icon */}
              <div style={{ cursor: 'pointer', fontSize: '24px' }}>
                <i
                  className="fa fa-map-marker-alt"
                  onClick={!locationError ? toggleMap : null} // Disable onClick when there's an error
                  aria-label="Toggle map"
                  style={{ pointerEvents: locationError ? 'none' : 'auto', color: locationError ? 'gray' : 'black' }} // Visual indication
                />
              </div>
            </div>

            {/* Conditionally render the map */}
            {showMap && (
              <div style={{ marginTop: '20px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: '400px', width: '100%' }}
                  whenCreated={mapInstance => {
                    mapRef.current = mapInstance;
                    // Immediately set the view on first load if a library is selected
                    if (selectedLibrary) {
                      mapInstance.setView(
                        [
                          parseFloat(selectedLibrary.lat),
                          parseFloat(selectedLibrary.lon),
                        ],
                        12,
                        { animate: true, duration: 1.5 },
                      );
                    }
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {validLibraries.map(library => (
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
                        {library.name} <br /> {intl.formatMessage({id: 'app.global.lat',})}: {library.latitude},
                        {intl.formatMessage({id: 'app.global.lon',})}: {library.longitude}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}

            {locationError && (
              <div className="alert alert-danger mt-3">{locationError}</div>
            )}

            {/* Conditionally render the information, message, and Reset button */}
            {selectedLibrary && (
              <div
                className="text-center mt-3"
                style={{ transition: 'all 0.3s ease-in-out' }}
              >
                <div className="alert alert-info alert-info-custom">
                  {intl.formatMessage(messages.ContactLibraryManager)}
                </div>
                <div className="div-responsive">
                  <div className="div-table">
                    <div className="div-table-row">
                      <div
                        className="div-table-header"
                        style={{ width: '25%' }}
                      >
                        {intl.formatMessage({ id: 'app.global.library' })}
                      </div>
                      <div className="div-table-cell">
                        {selectedLibrary.label}
                      </div>
                    </div>
                    <div className="div-table-row">
                      <div
                        className="div-table-header"
                        style={{ width: '25%' }}
                      >
                        {intl.formatMessage({
                          id: 'app.global.address',
                        })}
                      </div>
                      <div className="div-table-cell">
                        {selectedLibrary.address || 'N/A'}
                      </div>
                    </div>
                    <div className="div-table-row">
                      <div
                        className="div-table-header"
                        style={{ width: '25%' }}
                      >
                        {intl.formatMessage({
                          id: 'app.libraries.ill_email',
                        })}
                      </div>
                      <div className="div-table-cell">
                        {selectedLibrary.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  color="primary"
                  className="reset-button"
                  onClick={handleReset}
                  aria-label="Reset the selected library"
                >
                  {intl.formatMessage({
                    id: 'app.global.reset',
                  })}
                </Button>
              </div>
            )}

            <hr className="hr-custom" />
            <div className="text-center text-center-custom">
              <p>
                <strong>
                  {intl.formatMessage(messages.LibNotFoundRegMessage)}
                </strong>
              </p>
              <Link
                className="btn btn-primary register-library-button"
                to={'/register-library'}
                aria-label="Register a new library"
              >
                {intl.formatMessage(messages.RegisterNewLibrary)}
              </Link>
            </div>
          </div>
        </div>
      </>
    </LandingPageBox>
  );
};

export default LandingPageLibrariesBox;
