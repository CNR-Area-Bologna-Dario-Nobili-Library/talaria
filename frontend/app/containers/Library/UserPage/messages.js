import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LibraryUserPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Edit user status',
  },
  name: {
    id: 'app.global.name',
    defaultMessage: 'Nome',
  },
  department_id: {
    id: 'app.global.department',
    defaultMessage: 'Department',
  },
  title_id: {
    id: 'app.global.title',
    defaultMessage: 'Title',
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
  status: {
    id: 'app.global.status',
    defaultMessage: 'Status',
  },
  statusUpdateMessage: {
    id: `${scope}.statusUpdateMessage`,
    defaultMessage: 'Status updated',
  },

});
