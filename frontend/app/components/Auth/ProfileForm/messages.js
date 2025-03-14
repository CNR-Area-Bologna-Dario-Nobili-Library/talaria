/*
 * UserProfile Messages
 *
 * This contains all the text for the SignupForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.UserProfile';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Account Profile!',
  },
  subtitle: {
    id: `${scope}.subtitle`,
    defaultMessage: 'Update your profile',
  },
  
});
