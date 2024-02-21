import { defineMessages } from 'react-intl';

export const scope = 'app.containers.BelongingLibraries';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: "Belonging Libraries",
  },
  library: {
    id: `${scope}.library`,
    defaultMessage: "Library",
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: "Date",
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: "Status",
  },
  details: {
    id: `${scope}.details`,
    defaultMessage: "Details",
  },
});
