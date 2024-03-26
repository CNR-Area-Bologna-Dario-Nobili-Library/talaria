/*
 * References Form
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.components.PendingOperatorsList';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Pending Operators',
  },  
  PendingOperatorsNotFound: {
    id: `${scope}.PendingOperatorsNotFound`,
    defaultMessage: 'Operators not found'
  }


  
});
