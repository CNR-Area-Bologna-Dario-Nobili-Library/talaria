/*
 * Library Form
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.components.LibrarySearchPanel.header',
    defaultMessage: 'Library search',    
  },
  name: {
    id: 'app.libraries.name',
    defaultMessage: "Library name",
  },
  institution_type_id: {
    id: `app.libraries.institution_type_id`,
    defaultMessage: "Institution Type ID",
  },
  subject_id: {
    id: `app.libraries.subject_id`,
    defaultMessage: 'Subject ID',
  },
  country_id: {
    id: `app.global.country`,
    defaultMessage: 'Country ID',
  },

  identifier_type_id: {
    id: `app.libraries.identifier_type_id`,
    defaultMessage: 'identifier_type_id',
  },

  identifier_code: {
    id: `app.libraries.identifier_code`,
    defaultMessage: 'identifier_code',
  },

  status: {
    id: `app.libraries.status`,
    defaultMessage: 'Status',
  },

  profile_type: {
    id: `app.libraries.profile_type`,
    defaultMessage: 'Profile type',
  },
});

