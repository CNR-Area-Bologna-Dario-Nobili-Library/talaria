/*
 * CustomForm Messages
 *
 * This contains all the text for the HeaderBar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CustomForm';

export default defineMessages({
  select: {
    id: `${scope}.select`,
    defaultMessage: 'Select',
  },
  invalid_field: {
    id: `app.global.invalid_field`,
  },
  cancel: {
    id: `app.global.cancel`,
    defaultMessage: 'Cancel',
  },
  reset: {
    id: `app.global.resetAll`,
    defaultMessage: 'Reset all',
  },
  submit: {
    id: 'app.global.submit',
    defaultMessage: 'Submit',
  }
});
