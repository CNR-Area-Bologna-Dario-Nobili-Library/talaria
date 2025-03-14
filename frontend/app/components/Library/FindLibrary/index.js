import React, {useEffect, useState,useRef} from 'react'
import {Row, Col, Button} from 'reactstrap'
import Select, { components } from 'react-select';
import {useIntl} from 'react-intl';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './style.scss';

export const FindLibrary = (props) => {
    const {data,libraryList} = props
    
    const [libraryId, setLibraryId] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [showRegisterOption, setShowRegisterOption] = useState(false);
    const [showLibrarianPrompt, setShowLibrarianPrompt] = useState(false);
    const [showMap, setShowMap] = useState(false); // Hide the map by default
    const [mapCenter, setMapCenter] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [mounted,setMounted]=useState(false);    
    const mapRef = useRef(null);
    const intl = useIntl();
    const libraries = libraryList || [];    

  // Calculate the distance between two coordinates (in km)
  /* NOT USED
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
  };*/

  useEffect(() => {        
    setShowRegisterOption(true)   
    if(libraries && libraries.length>0 && selectedLibrary)   
      setShowRegisterOption(false)   
                
  }, [selectedLibrary ||  libraries]  
  )
  

  useEffect(() => {
    setMounted(true)

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
              setLocationError(intl.formatMessage({id:"app.global.gps.denied"}));
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(intl.formatMessage({id:"app.global.gps.unavailable"}));
              break;
            case error.TIMEOUT:
              showMap &&
                setLocationError(intl.formatMessage({id:"app.global.gps.timeout"}));
              break;
            case error.UNKNOWN_ERROR:
              setLocationError(intl.formatMessage({id:"app.global.gps.error"}));
              break;
            default:
              setLocationError(intl.formatMessage({id:"app.global.gps.error"}));
          }
        },
        { timeout: 10000 }, // Timeout after 10 seconds
      );
    } else {
      setLocationError(intl.formatMessage({id:"app.global.gps.notsupported"}));
    }

    setShowRegisterOption(false)    
  }, []);

  const resetSearchResults = () => {
    setLibraryId(null);
    setSelectedValue(null);
    setSelectedLibrary(null);
    setShowMap(false); // Hide the map
    setLocationError(null); // Clear any error message      
  };

  const onSearchInputChange = (query, e) => {
    if (e.action === 'clear') {
      resetSearchResults();
    } else if (e.action === 'input-change') {
      handleLibraryChange()
    }
  };

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
              setLocationError(intl.formatMessage({id:"app.components.FindLibrary.noGPScoordinates"})); // Display error message
            }
          } else {
            // Handle case where no valid library information is found
            setShowMap(false); // Hide the map
            setLocationError(intl.formatMessage({id:"app.components.FindLibrary.noinfo"}));
          }
    
          
          setShowLibrarianPrompt(false);
    
        } else {
          // Reset values if no library is selected
          setLibraryId(null);
          setSelectedValue(null);
          setSelectedLibrary(null);
          setShowMap(false); // Hide the map
          setLocationError(null); // Clear any error message          
          
        }
      };
      
    
    
    
      // Toggle map display
      /*const toggleMap = () => {
        setShowMap(!showMap);
      };*/
    
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
 


// Custom List component to include the Register new library link
const MenuList = props => {
  return (
    <components.MenuList {...props}>
      {props.children}
      {showRegisterOption && (
        <div
          className="register-library-link"
          style={{ padding: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          {intl.formatMessage({id:'app.components.FindLibrary.clickHereToRegister'})}<br/>
          <Link
              className="btn btn-primary register-library-button"
              to={'/register-library'}
              aria-label={intl.formatMessage({id:'app.components.FindLibrary.registerButton'})}
              >
               {intl.formatMessage({id:'app.components.FindLibrary.registerButton'})}
              </Link>       
        </div>
      )}
    </components.MenuList>
  );
};


    return (
    mounted && <>
        <div className="d-flex justify-content-between align-items-center">
              <div style={{ flex: 1, marginRight: '20px' }}>
                <Select
                  name="library_id"
                  id="library_id"
                  isClearable={true}
                  aria-label={intl.formatMessage({ id: 'app.global.search' })}
                  classNamePrefix="select-container"
                  options={libraries}
                  onChange={handleLibraryChange}           
                  onInputChange={onSearchInputChange}  
                  filterOption={filterLibraries} // Apply custom filter logic
                  value={selectedValue}
                  placeholder={intl.formatMessage({ id: 'app.global.search' })}                
                  isSearchable={true}
                  noOptionsMessage={()=>intl.formatMessage({ id: 'app.global.noresult' })} 
                  required={true}           
                  closeMenuOnSelect={true}
                  onSelectResetsInput={false}
                  hideSelectedOptions={false}     
                  components={{ MenuList }} 
                />
              </div>

              {/* Map Toggle Icon 
              <div style={{ cursor: 'pointer', fontSize: '24px' }}>
                <i
                  className="fa fa-map-marker-alt"
                  onClick={!locationError ? toggleMap : null} // Disable onClick when there's an error
                  aria-label="Toggle map"
                  style={{ pointerEvents: locationError ? 'none' : 'auto', color: locationError ? 'gray' : 'black' }} // Visual indication
                />
              </div>*/}
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
                    {selectedLibrary.town && ", "+selectedLibrary.town}
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
                {/* 
                ADD: Library name, Address, City, Nation, Email ILL service, Institution name
                */}
                </div>
                <div className="alert alert-warning mt-2">
                  {intl.formatMessage({id:'app.components.FindLibrary.askLibraryManagerToBeInvited'})}
                </div>
            </div>           
            </div>
        )}

        {/*!selectedLibrary && 
        <>
          <hr className="hr-custom" />
          <div className="text-center">
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
        </>*/}
    </>
)

}

export default FindLibrary;
