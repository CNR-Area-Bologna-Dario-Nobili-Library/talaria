import {useIntl} from 'react-intl';

//return CSS class to use to render a "permission/ability"
export const permissionBadgeClass = (p) => {
    let ty="badge-info";

    switch (p) {
      case 'manage': 
      case 'manage-users':ty="badge-danger"; break;          

      case 'borrow':
      case 'ill-borrow': ty="badge-primary"; break;          

      case 'lend': 
      case 'ill-lend': ty="badge-secondary"; break;

      case 'deliver': ty="badge-warning"; break;     
      case 'manage-licenses': ty="badge-dark"; break;       
    }

    return ty;
}

export const translatePerm = (permKey) => {

  const intl = useIntl();

  return intl.formatMessage({id: 'app.global.permissions.'+permKey});
}

export const translateRole = (roleKey) => {

  const intl = useIntl();

  return intl.formatMessage({id: 'app.global.roles.'+roleKey});
}
