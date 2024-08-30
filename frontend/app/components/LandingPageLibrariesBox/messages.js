/*
 * Notification Messages
 *
 *
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.LandingPageLibrariesBox';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'LandingPageLibrariesBox',
  },
  OpenURLPubmed: {
    id: `${scope}.OpenURLPubmed`,
    defaultMessage: 'Import from OpenURL/Pubmed',
  },
  RequestRejected: {
    id: `${scope}.RequestRejected`,
    defaultMessage: 'No Actions, Request Rejected',
  },
  AreYouLibrarian: {
    id: `${scope}.AreYouLibrarian`,
    defaultMessage: 'Are you a Librarian?',
  },
  RegisterLibraryCommunity: {
    id: `${scope}.RegisterLibraryCommunity`,
    defaultMessage: 'Would you like to register a new library in the XXX Community?',
  },
  CheckLibraryAvailability: {
    id: `${scope}.CheckLibraryAvailability`,
    defaultMessage: 'Before starting, check if the library is not already present in the Community.',
  },
  ContactLibraryManager: {
    id: `${scope}.ContactLibraryManager`,
    defaultMessage: 'You may contact the library manager to be invited as a library operator. Please logout and contact the library manager.',
  },
  LibNotFoundRegMessage: {
    id: `${scope}.LibNotFoundRegMessage`,
    defaultMessage: 'If you have not found the library, you can register it.',
  },
  RegisterNewLibrary: {
    id: `${scope}.RegisterNewLibrary`,
    defaultMessage: 'Register New Library',
  },

});
