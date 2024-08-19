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
  const departments = props.library.departmentOptionList || [];
  const titles = props.titles || [];
  const libraries = props.libraries || [];
  const [showForm, setShowForm] = useState(false);
  const [libraryId, setLibraryId] = useState(null); // New state for library ID
  const [selectedValue, setSelectedValue] = useState(null); // New state for selected value

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
    // New library change handler
    setLibraryId(selectedOption ? selectedOption.value : null);
    setSelectedValue(selectedOption);
  };

  const isSubmitDisabled = !libraryId; // New submit button state

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    if (isNew) {
      if (params.library_id && parseInt(params.library_id, 10) > 0) {
        dispatch(
          requestAccessToLibrary({
            ...data,
            user_id: props.auth.user.id,
            library_id: params.library_id,
          }),
        );
      } else {
        dispatch(
          requestAccessToLibrary({
            ...data,
            user_id: props.auth.user.id,
            url: params,
          }),
        );
      }
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

  return (
    <>
      {patron.my_libraries.data.length > 0 && !showForm ? (
        <div>
          <div className="box p-3 mb-3 text-center">
            <div className="d-flex justify-content-center align-items-center mt-5">
              <div className="card text-center" style={{ width: '55rem' }}>
                <div className="card-body">
                  <p className="card-text lead">
                    {intl.formatMessage(messages.jointoLibIntroduction)}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="btn btn-success mt-2"
              onClick={() => history.push('/patron/references/new')}
              style={{ width: '200px' }}
            >
              {intl.formatMessage(messages.buttonReferenceManager)}
            </button>
          </div>

          <BelongingLibraries
            librariesList={patron.my_libraries.data}
            gridtitleiconLink="/patron/my-libraries"
            history={history}
            dispatch={dispatch}
            showeditbutton={true}
          />
          <center>
            <button
              className="btn btn-secondary mt-3"
              style={{ width: '200px' }}
              onClick={() => history.push('/patron/my-libraries')}
            >
              {intl.formatMessage(messages.manageYourLibraries)}
            </button>
            <button
              className="btn btn-primary mt-3 ml-5"
              style={{ width: '200px' }}
              //onClick={() => history.push('/patron/my-libraries/new')}
              onClick={() => setShowForm(true)}
            >
              {intl.formatMessage(messages.joinNewLibrary)}
            </button>
          </center>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="container mt-3">
          <div className="mb-4">
            <h1>{intl.formatMessage(messages.areYouPatron)} </h1>
            <p>
              {/* Search for a library name you want to join as a Patron. Search by
              library name or use the geolocalization button. */}
              {intl.formatMessage(messages.searchLibrary)}
            </p>
          </div>
          {/* Box 1: Library and Dropdown */}
          <div className="card mb-4">
            <div className="card-body">
              <label htmlFor="library_id">Library</label>
              <div className="d-flex align-items-center">
                <div style={{ flex: 1 }}>
                  <Select
                    name="library_id"
                    id="library_id"
                    styles={{
                      container: provided => ({ ...provided, width: '100%' }),
                    }}
                    options={options}
                    onChange={handleLibraryChange}
                    value={selectedValueAll || selectedValue}
                    isSearchable
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedValue && (
            <>
              {/* Box 2: Assign Your Preferred Label */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4>
                    <strong>
                      {intl.formatMessage(messages.assignLibraryLabel)}
                    </strong>
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

              {/* Box 3: Insert Your Data */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4>
                    <strong>
                      {intl.formatMessage(messages.defineLibraryData)}
                    </strong>
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

              {/* Centered Submit Button */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitDisabled}
                >
                  {isNew ? 'Join as a Patron' : 'Update'}
                </button>
              </div>
            </>
          )}
        </form>
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

export default compose(withConnect)(JointoLibPage);
