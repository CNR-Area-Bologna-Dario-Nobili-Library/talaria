import React, { useEffect, useState } from 'react';
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
  requestLibraryDepartmentsOptionList,
  requestGetLibraryListNearTo,
  requestSearchPlacesByText,
} from '../actions';
import { requestMyLibraries } from '../actions';
import { fields, fieldsIsNew } from './fields';
import BelongingLibraries from '../BelongingLibraries/';
import { requestGetLibrary } from 'containers/Library/actions';
import {
  placesSelector,
  librariesSelector,
  titlesSelector,
  libraryListSelector,
} from '../selectors';

import Select from 'react-select';
import makeSelectPatron, { isPatronLoading } from '../selectors';
import { CustomForm } from 'components';
import messages from './messages';
import history from 'utils/history';

function JointoLibPage(props) {
  const intl = useIntl();
  const { auth, dispatch, isLoading, patron, match } = props;
  const { params } = match;
  const isNew = !params || !params.id || params.id === 'new';
  const departments = props.library.departmentOptionList || []; // Ensure departmentOptionList is not undefined
  const titles = props.titles || []; // Ensure titles is not undefined
  const libraries = props.libraries || [];
  /*Paging*/
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // default items per page::
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  /*Map Selection*/
  const [selectedMarker, setSelectedMarker] = useState({});
  const [showMapForm, setShowMapForm] = useState(false);
  const Library_id_URL = match.params.library_id;
  const [SelectedLibraryID, setSelectedLibraryID] = useState('');
  const [selectedValueAll, setselectedValueAll] = useState(null);
  const librariesList = patron.my_libraries.data;
  const librariesToDisplay = librariesList.slice(startIndex, endIndex);

  // Function to handle changes in items per page
  const handleItemsPerPageChange = event => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(currentPage); // Reset to first page when items per page changes
  };

  const handleGoToReferenceManager = () => {
    history.push('/patron/references/new');
  };

  const handleGoToMyLibraries = () => {
    history.push('/patron/my-libraries');
  };

  // Function to handle page change
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handleShowMapForm = () => {
    setShowMapForm(!showMapForm); // Toggle the value
  };

  useEffect(() => {
    dispatch(requestLibraryOptionList());
    //dispatch(requestLibraryDepartmentsOptionList());
    dispatch(requestGetTitlesOptionList());
    dispatch(requestMyLibraries());
    if (params && params.library_id) {
      dispatch(requestGetLibrary(params.library_id, 'departments'));
      if (!isNew) {
        dispatch(requestUser(params.library_id, params.id));
      }
    }
  }, [dispatch, params]);
  //[dispatch, params, isNew]

  // Define options for the React Select dropdown
  const options = libraries.map(library => ({
    value: library.value,
    label: library.label,
    isDisabled: librariesToDisplay.some(
      item => item.library_id === library.value,
    ),
  }));

  const selectedOptionIndex = options.findIndex(
    option => option.value === parseInt(params.library_id, 10),
  );
  const selectedValue =
    selectedOptionIndex !== -1 ? options[selectedOptionIndex] : null;

  const handleStateUpdate = LibraryID => {
    setSelectedLibraryID(LibraryID);
    dispatch(requestGetLibrary(LibraryID, 'departments'));
  };

  const handleLibraryChange = event => {
    var libraryFromMap = options.findIndex(
      option => option.value === parseInt(event, 10),
    );
    var value = libraryFromMap !== -1 ? options[libraryFromMap] : options[0];
    setselectedValueAll(value);
    handleStateUpdate(value.value);
    setShowMapForm(false);
  };

  const handleMarkerSelection = LibraryID => {
    var selectedLibFromUrl = options.findIndex(
      option => option.value === parseInt(LibraryID, 10),
    );
    var value =
      selectedLibFromUrl !== -1 ? options[selectedLibFromUrl] : options[0];
    setselectedValueAll(value);
    handleStateUpdate(LibraryID);
    setShowMapForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(requestLibraryDepartmentsOptionList());
    };
    fetchData();
    //}, [selectedLibrary, SelectedLibraryID]);
  }, [SelectedLibraryID]);

  const handleChangeData = (field_name, value) => {
    //Usato per aggiornare le tendine con dipartimenti/... un base alla biblio scelta
    if (field_name === 'library_id' && value)
      dispatch(requestGetLibrary(value, 'departments'));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (isNew) {
      // Check if params.library_id exists and is greater than 0
      if (params.library_id && parseInt(params.library_id, 10) > 0) {
        // Dispatch requestAccessToLibrary with library_id
        dispatch(
          requestAccessToLibrary({
            ...data,
            user_id: props.auth.user.id,
            library_id: params.library_id,
          }),
        );
      } else {
        // Dispatch requestAccessToLibrary without library_id
        dispatch(
          requestAccessToLibrary({
            ...data,
            user_id: props.auth.user.id,
          }),
        );
      }
    } else {
      // Dispatch requestUpdateAccessToLibrary for updating existing access
      dispatch(
        requestUpdateAccessToLibrary({
          ...data,
          library_id: params.library_id,
          id: params.id,
        }),
      );
    }
  };

  const handleMarkerClick = event => {
    console.log('Marker clicked. State updated.');
  };

  const statusClass = status => {
    switch (status) {
      case 0:
        return 'disabled';
        break;
      case 1:
        return 'success';
        break;
      case 2:
        return 'pending';
        break;
    }
    return status;
  };

  return (
    <>
      {/* Render CustomForm based on the state */}
      {showMapForm && (
        <CustomForm
          submitCallBack={formData =>
            dispatch(
              requestAccessToLibrary(
                { ...formData, user_id },
                intl.formatMessage(messages.libraryCreateMessage),
              ),
            )
          }
          submitText={intl.formatMessage(messages.librarySubmit)}
          fields={fieldsIsNew}
          selectedMarker={selectedMarker}
          messages={messages}
          backButton={false}
          onChangeData={(field_name, value) =>
            handleChangeData(field_name, value)
          }
          onPlacesSearch={search => dispatch(requestSearchPlacesByText(search))}
          places={props.places}
          placesFreeSearchPlaceholder={intl.formatMessage(
            messages.placesFreeSearchPlaceholder,
          )}
          getMarkers={pos => dispatch(requestGetLibraryListNearTo(pos))}
          markers={props.libraryList}
          onMarkerClick={handleMarkerClick}
          markerPopupComponent={(marker, chooseMarkerFromMap) => (
            <div className="libraryPopup">
              <div className="card-body">
                <h5 className="card-title">{marker.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {marker.address}
                </h6>
                <button onClick={() => handleMarkerSelection(marker.id)}>
                  Select this Library
                </button>
                {/* <NavLink className="btn btn-info" to={"/public/library/" + marker.id}>Library detail</NavLink> */}
                {/* <NavLink className="btn btn-primary" to="#" onClick={() => chooseMarkerFromMap(marker)}>Subscribe to this library</NavLink> */}
              </div>
            </div>
          )}
        />
      )}

      <form onSubmit={handleSubmit} className="container mt-3">
        <div className="row">
          <div className="col-md-4">
            {/* <div className="form-group"> */}
            <label htmlFor="library_id">Library</label>
            <div className="d-flex align-items-center">
              <Select
                name="library_id"
                id="library_id"
                styles={{
                  container: provided => ({
                    ...provided,
                    width: '300px',
                  }),
                }}
                options={options}
                onChange={selectedOption => {
                  handleLibraryChange(
                    selectedOption ? selectedOption.value : '',
                  );
                }}
                value={selectedValueAll || selectedValue}
                isDisabled={Library_id_URL > 0}
                isSearchable // Enables searching
              />
              <button
                className="btn btn-success ml-2"
                type="button"
                onClick={handleShowMapForm}
                disabled={Library_id_URL > 0}
              >
                <i className="fas fa-map-marker-alt" />{' '}
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="department_id">Department</label>
              <Select
                name="department_id"
                id="department_id"
                options={departments.map((dept, index) => ({
                  value: dept.value,
                  label: dept.label,
                }))}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="titleId">Title</label>
              <Select
                name="title_id"
                id="title_id"
                options={titles.map((title, index) => ({
                  value: title.value,
                  label: title.label,
                }))}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="userReferent">User Referent</label>
              <input
                type="text"
                id="userReferent"
                name="user_referent"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="label">Label</label>
              <input
                type="text"
                id="label"
                name="label"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="user_mat">User Matriculation</label>
              <input
                type="text"
                id="user_mat"
                name="user_mat"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="user_service_phone">Service Phone</label>
              <input
                type="tel"
                id="user_service_phone"
                name="user_service_phone"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="user_service_email">Service Email</label>
              <input
                type="email"
                id="user_service_email"
                name="user_service_email"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {isNew ? 'Join to Library' : 'Update'}
        </button>

        <BelongingLibraries
          librariesToDisplay={librariesToDisplay}
          librariesList={librariesList}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          statusClass={statusClass}
          handleGoToReferenceManager={handleGoToReferenceManager}
          handleGoToMyLibraries={handleGoToMyLibraries}
          auth={auth}
        />
      </form>
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

  //librarydepartments: librarydepartmentSelector(),
  // Add other selectors if needed
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

export default compose(withConnect)(JointoLibPage);
