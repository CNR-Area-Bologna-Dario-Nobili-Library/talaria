import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';
import messages from './messages';
import makeSelectLibrary from 'containers/Library/selectors';
import {
  requestAccessToLibrary,
  requestUpdateAccessToLibrary,
  requestGetTitlesOptionList,
  requestMyLibraries,
  requestLibraryOptionList,
} from '../actions';
import {
  placesSelector,
  librariesSelector,
  titlesSelector,
  libraryListSelector,
} from '../selectors';
import makeSelectPatron, { isPatronLoading } from '../selectors';
import MyLibraryForm from 'components/Patron/MyLibraryForm';
import history from 'utils/history';

function MyLibraryPage(props) {
  const intl = useIntl();
  const { auth, dispatch, patron, match } = props;
  const { params } = match;
  const isNew = !params || !params.id || params.id === 'new';
  const departments = props.library.departmentOptionList || [];
  const titles = props.titles || [];
  const libraries = props.libraries || [];

  const [formData, setFormData] = useState({
    label: '',
    department_id: '',
    title_id: '',
    user_referent: '',
    user_mat: '',
    user_service_phone: '',
    user_service_email: '',
  });
  const [libraryId, setLibraryId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false); // Prevent re-initializing form data
  const [showForm, setShowForm] = useState(true); // Flag to control form display
  const [countdown, setCountdown] = useState(10); // Countdown state

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSearchInputChange = debounce(input => {
    setSearchInput(input);
  }, 300);

  // Identify the library to edit, if in edit mode
  const libraryToEdit = patron.my_libraries.data.find(
    lib =>
      lib.id === parseInt(params.id, 10) &&
      lib.library_id === parseInt(params.library_id, 10),
  );

  useEffect(() => {
    dispatch(requestLibraryOptionList());
    dispatch(requestGetTitlesOptionList());
    dispatch(requestMyLibraries());
  }, [dispatch]);

  // Check if the library from the URL (jointolib/50) exists in patron.my_libraries
  useEffect(() => {
    if (
      isNew &&
      params.library_id &&
      libraries.length > 0 &&
      patron.my_libraries.data.length > 0
    ) {
      const selectedLibrary = libraries.find(
        lib => lib.value === parseInt(params.library_id, 10),
      );

      if (selectedLibrary) {
        const alreadyInMyLibraries = patron.my_libraries.data.some(
          library => library.library_id === parseInt(params.library_id, 10),
        );

        if (alreadyInMyLibraries) {
          setErrorMessage(
            `You are already registered for the library: ${
              selectedLibrary.label
            }.`,
          );
          // Hide the form
          setShowForm(false);

          // Use useEffect to manage the countdown logic
          const countdownInterval = setInterval(() => {
            setCountdown(prevCount => prevCount - 1);
          }, 1000);

          // Clear the interval after countdown is done
          const redirectTimeout = setTimeout(() => {
            clearInterval(countdownInterval);
            history.push('/patron/my-libraries'); // Redirect when countdown reaches 0
          }, countdown * 1000);

          return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
          };
        }
      }
    }
  }, [
    isNew,
    params.library_id,
    libraries,
    patron.my_libraries.data,
    countdown,
  ]);

  useEffect(() => {
    if (!isFormInitialized) {
      // Edit mode: pre-populate all fields including dropdown (LibraryDown should be disabled)
      if (!isNew && libraryToEdit) {
        setFormData({
          label: libraryToEdit.label || '',
          department_id: libraryToEdit.department_id || '',
          title_id: libraryToEdit.title_id || '',
          user_referent: libraryToEdit.user_referent || '',
          user_mat: libraryToEdit.user_mat || '',
          user_service_phone: libraryToEdit.user_service_phone || '',
          user_service_email: libraryToEdit.user_service_email || '',
        });

        setSelectedValue({
          value: libraryToEdit.library_id,
          label: libraryToEdit.name || '',
        });
        setLibraryId(libraryToEdit.library_id);

        setIsFormInitialized(true); 
      }

      // If in "new" mode (when inviting to a library), pre-select only the library and allow dropdown usage
      if (isNew && params.library_id && libraries.length > 0) {
        const selectedLibraryOption = libraries.find(
          lib => lib.value === parseInt(params.library_id, 10),
        );

        // Check if the selected library is already in patron.my_libraries to Redirect
        const alreadyInMyLibraries = patron.my_libraries.data.some(
          library => library.library_id === parseInt(params.library_id, 10),
        );

        if (selectedLibraryOption && !alreadyInMyLibraries) {
          setSelectedValue({
            value: selectedLibraryOption.value,
            label: selectedLibraryOption.label,
          });
          setLibraryId(selectedLibraryOption.value);
          setFilteredOptions([
            {
              value: selectedLibraryOption.value,
              label: selectedLibraryOption.label,
            },
          ]);
        } else {
          setSelectedValue(null);
          setLibraryId(null);
          setErrorMessage('You are already registered for this library.');
        }

        setFormData({
          label: '',
          department_id: '',
          title_id: '',
          user_referent: '',
          user_mat: '',
          user_service_phone: '',
          user_service_email: '',
        });

        setIsFormInitialized(true);
      }
    }
  }, [
    isNew,
    libraryToEdit,
    params.library_id,
    isFormInitialized,
    libraries,
    patron.my_libraries,
  ]);

  // Update filtered library options based on search input when user types 3 characters or more
  useEffect(() => {
    if (searchInput.length >= 3) {
      // Filter the libraries based on the search input
      const options = libraries
        .filter(library =>
          library.label.toLowerCase().includes(searchInput.toLowerCase()),
        )
        .map(library => ({
          value: library.value,
          label: library.label,
          isDisabled: patron.my_libraries.data.some(
            item => item.library_id === library.value, // Disable if library_id matches
          ),
        }));
      setFilteredOptions(options);
    } else if (!params.library_id) {
      // If no params.library_id is provided and search input is less than 3 characters, clear the dropdown
      setFilteredOptions([]);
    }
  }, [searchInput, libraries, patron.my_libraries.data]);

  const handleLibraryChange = selectedOption => {
    setLibraryId(selectedOption ? selectedOption.value : null);
    setSelectedValue(selectedOption);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMessage('');

    if (isSubmitting) return;

    if (
      !formData.user_service_email ||
      formData.user_service_email.trim() === ''
    ) {
      setErrorMessage('Email address cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isNew) {
        if (libraryId && parseInt(libraryId, 10) > 0) {
          await dispatch(
            requestAccessToLibrary({
              ...formData,
              user_id: auth.user.id,
              library_id: libraryId,
            }),
          );
        } else {
          await dispatch(
            requestAccessToLibrary({
              ...formData,
              user_id: auth.user.id,
              url: params,
            }),
          );
        }
        history.push('/patron/my-libraries');
      } else {
        await dispatch(
          requestUpdateAccessToLibrary({
            ...formData,
            library_id: params.library_id || libraryId,
            id: params.id,
          }),
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setErrorMessage('Too many requests. Please try again later.');
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        setErrorMessage(
          error.response.data.errors.user_service_email[0] || 'Error occurred',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
          <br />
          <br />
          Redirecting To your belonging libraries in <b>{countdown} Seconds</b>... 
        </div>
      )}
      {showForm && (
        <MyLibraryForm
          isNew={isNew}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          departments={departments}
          titles={titles}
          selectedValue={selectedValue}
          handleLibraryChange={handleLibraryChange}
          handleSearchInputChange={handleSearchInputChange}
          filteredOptions={filteredOptions}
          errorMessage={errorMessage}
          intl={intl}
          messages={messages}
        />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLibraryPage);
