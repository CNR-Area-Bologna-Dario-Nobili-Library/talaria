import React from 'react';
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

export const libraryStatusIcon = (st) => {  

  let ret="";

  let intl=useIntl();
  
  switch (st) {
      case -1: ret=<i className='fa-solid fa-circle-plus' title={intl.formatMessage({id: "app.manager.libraries.icon.new"})}></i>
               break;
      case 0: ret=<i className='fa-solid fa-ban' title={intl.formatMessage({id: "app.manager.libraries.icon.disabled"})}></i>
              break;         
      case 1: ret=<i className='fa-solid fa-circle-check' title={intl.formatMessage({id: "app.manager.libraries.icon.enabled"})}></i>
              break;                 
      case 2: ret=<i className='fa-solid fa-rotate-right' title={intl.formatMessage({id: "app.manager.libraries.icon.renewing"})}></i>
      break;                 

      case 3: ret=<i className='fa-solid fa-poo' title={intl.formatMessage({id: "app.manager.libraries.icon.disabledBad"})}></i>
      break;                  

      case 4: ret=<i className='fa-solid fa-stopwatch' title={intl.formatMessage({id: "app.manager.libraries.icon.disabledExpired"})}></i>
      break;                 

      case 5: ret=<i className='fa-solid fa-coins' title={intl.formatMessage({id: "app.manager.libraries.icon.disabledNotPay"})}></i>
      break;                 

      default: ret=<span>{st}</span>
    }

  return ret;
}


/*export function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false,
  };
  const opt = {
    ...defaultOptions,
    ...options,
  };
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;
  if (!browserLocales) {
    return undefined;
  }
  return browserLocales.map(locale => {
    const trimmedLocale = locale.trim();
    return opt.languageCodeOnly
      ? trimmedLocale.split(/-|_/)[0]
      : trimmedLocale;
  });
}*/