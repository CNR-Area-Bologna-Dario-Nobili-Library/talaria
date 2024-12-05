/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.MyLibrariesPage';

export default defineMessages({
  joinLibrary: {
    id: `${scope}.joinLibrary`,
    defaultMessage: 'Join library',
  },
  joinAsPatron: {
    id: `${scope}.joinAsPatron`,
    defaultMessage: 'Join as patron',
  },
  editData: {
    id: `${scope}.editData`,
    defaultMessage: 'Edit data',
  },
  searchLibrary: {
    id: `${scope}.searchLibrary`,
    defaultMessage: 'Search library intro text',
  },
  editDataIntro: {
    id: `${scope}.editDataIntro`,
    defaultMessage: 'Edit data intro text....',
  },
  dataIntro: {
    id: `${scope}.dataIntro`,
    defaultMessage: 'Data intro text....',
  },

  library_id: {
    id: `${scope}.library_id`,
    defaultMessage: 'Select library',
  },
  name: {
    id: 'app.global.library',
    defaultMessage: 'Library',
  },
  details: {
    id: `${scope}.details`,
    defaultMessage: 'My data',
  },
  label: {
    id:`${scope}.libraryLabel`,
    defaultMessage: 'Assign your preferred label to this library (max 5 characters)',
  },
  department_id: {
    id: `${scope}.department_id`,
    defaultMessage: 'Select department',
  },
  title_id: {
    id: `${scope}.title_id`,
    defaultMessage: 'Select Title',
  },
  user_referent:{
    id: `${scope}.user_referent`,
    defaultMessage: 'Referent',
  },
  user_mat:{
    id: `${scope}.user_mat`,
    defaultMessage: 'Matricola',
  },
  user_service_phone:{
    id: `${scope}.user_service_phone`,
    defaultMessage: 'Service phone',
  },
  user_service_email:{
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
  update: {
    id: 'app.global.update',
    defineMessages: 'Update'
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
  }

});
