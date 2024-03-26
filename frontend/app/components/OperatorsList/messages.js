/*
 * References Form
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.components.OperatorsList';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Operators List',
  },  
  OperatorsNotFound: {
    id: `${scope}.OperatorsNotFound`,
    defaultMessage: 'Operators not found'
  }


  
});
