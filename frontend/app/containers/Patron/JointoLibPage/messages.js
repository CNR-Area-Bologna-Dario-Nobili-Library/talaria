import { defineMessages } from 'react-intl';

export const scope = 'app.containers.JointoLibPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'My Library',
  },
  headerNew: {
    id: `${scope}.headerNew`,
    defaultMessage: 'New Library',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Add a new library',
  },
  library_id: {
    id: `${scope}.library_id`,
    defaultMessage: 'Select library',
  },
  name: {
    id: 'app.global.library',
    defaultMessage: 'Library',
  },
  label: {
    id: 'app.global.label',
    defaultMessage: 'Label',
  },
  department_id: {
    id: `${scope}.department_id`,
    defaultMessage: 'Select department',
  },
  title_id: {
    id: `${scope}.title_id`,
    defaultMessage: 'Select Title',
  },
  user_referent: {
    id: `${scope}.user_referent`,
    defaultMessage: 'Referent',
  },
  user_mat: {
    id: `${scope}.user_mat`,
    defaultMessage: 'Matricola',
  },
  user_service_phone: {
    id: `${scope}.user_service_phone`,
    defaultMessage: 'Service phone',
  },
  user_service_email: {
    id: `${scope}.user_service_email`,
    defaultMessage: 'Service email',
  },
  preferred: {
    id: 'app.global.preferred',
    defaultMessage: 'Preferred',
  },
  status: {
    id: 'app.global.status',
    defaultMessage: 'Status',
  },
  libraryUpdateMessage: {
    id: `${scope}.updateMessage`,
    defaultMessage: 'Library updated',
  },
  libraryCreateMessage: {
    id: `${scope}.createMessage`,
    defaultMessage: 'Library added',
  },
  librarySubmit: {
    id: `${scope}.librarySubmit`,
    defaultMessage: 'Subscribe to library',
  },
  placesFreeSearchPlaceholder: {
    id: `${scope}.placesFreeSearchPlaceholder`,
    defaultMessage: 'Enter City/State to search on',
  },

  jointoLibIntroduction: {
    id: `${scope}.jointoLibIntroduction`,
    defaultMessage: 'Use this box to start managing your references and request them, to check and customize the libraries you have joined as a Patron or ask to join to a new library.',
  },

  buttonReferenceManager: {
    id: `${scope}.buttonReferenceManager`,
    defaultMessage: 'Goto Reference Manager',
  },

  manageYourLibraries: {
    id: `${scope}.manageYourLibraries`,
    defaultMessage: 'Manage your libraries',
  },

  joinNewLibrary: {
    id: `${scope}.joinNewLibrary`,
    defaultMessage: 'Join a library',
  },

  areYouPatron: {
    id: `${scope}.areYouPatron`,
    defaultMessage: 'Are you a Patron?',
  },

  searchLibrary: {
    id: `${scope}.searchLibrary`,
    defaultMessage: 'Search for a library name you want to join as a Patron.',
  },
  assignLibraryLabel: {
    id: `${scope}.assignLibraryLabel`,
    defaultMessage: 'Assign your preferred label to this library (max. 5 char)',
  },

  defineLibraryLabel: {
    id: `${scope}.defineLibraryLabel`,
    defaultMessage: 'it will make easier for you to manage and request from this library',
  },

  defineLibraryData: {
    id: `${scope}.defineLibraryData`,
    defaultMessage: 'Insert your data with respect to this library',
  },

  noassociatedlibraries: {
    id: `${scope}.noassociatedlibraries`,
    defaultMessage: 'No associated libraries!',
  }

});
