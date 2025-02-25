/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
// const enLocaleData = require('react-intl/locale-data/en');
// const deLocaleData = require('react-intl/locale-data/de');
// const itLocaleData = require('react-intl/locale-data/it');

const enTranslationMessages = require('./translations/en.json');
// const deTranslationMessages = require('./translations/de.json');
const itTranslationMessages = require('./translations/it.json');
const esTranslationMessages = require('./translations/es.json');
const trTranslationMessages = require('./translations/tr.json');
const arTranslationMessages = require('./translations/ar.json');

// addLocaleData(enLocaleData);
// addLocaleData(deLocaleData);
// addLocaleData(itLocaleData);

// prettier-ignore
const appLocales = [
  'en',  
  'it',
  'es',
  'tr',
  'ar'
];

//const DEFAULT_LOCALE = 'it';
var userLang = navigator.language || navigator.userLanguage;  //Browser default language
if (userLang.includes('-')) //en-US, it-IT, ar
{
  userLang = userLang.substring(0, 2).toLowerCase();
}
if (!appLocales.includes(userLang))  //if not supported -> fallback to english
    userLang = 'en'


//get user's preferred lang (stored on localStorage or get default lang from browser if supported or back to EN))
const DEFAULT_LOCALE = localStorage.getItem("lang") ? localStorage.getItem("lang") : userLang;



const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),  
  it: formatTranslationMessages('it', itTranslationMessages),
  es: formatTranslationMessages('es', esTranslationMessages),
  tr: formatTranslationMessages('tr', trTranslationMessages),
  ar: formatTranslationMessages('ar', arTranslationMessages),  
};

exports.appLocales = appLocales;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
