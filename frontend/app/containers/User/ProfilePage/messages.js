/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ProfilePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the HomePage container w/my little edit 5!',
  },
  updateMessage: {
    id: `${scope}.updateMessage`,
    defaultMessage: 'Profile Updated',
  },
});
