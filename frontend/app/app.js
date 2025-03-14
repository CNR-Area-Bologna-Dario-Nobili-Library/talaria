/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

const EventSource = NativeEventSource || EventSourcePolyfill;
// OR: may also need to set as global property
global.EventSource =  NativeEventSource || EventSourcePolyfill;
// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import 'app.scss'

// Import root app
import {App, LanguageProvider, AuthProvider} from 'containers';

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { RECAPTCHA_SITE_KEY } from "utils/constants";
import Toaster from 'components/Toaster';
// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';
import { initializeReactGA } from './ga';
// import CookieBar from "../../frontend/app/components/CookieBar";

// Create redux store with history
const initialState = {};
const { store } = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');


const render = messages => {
  initializeReactGA(history);
  ReactDOM.render(
    <Provider store={store}>
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} language={"it"}>
        {/*<SnackbarProvider maxSnack={3}>*/}
          <Toaster />
          <LanguageProvider messages={messages}>
            <ConnectedRouter history={history}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ConnectedRouter>
          </LanguageProvider>
        {/*</SnackbarProvider>*/}
      </GoogleReCaptchaProvider>
      {/*<CookieBar/>*/}
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  //require('offline-plugin/runtime').install(); // eslint-disable-line global-require
  
  const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require 

  //Update service worker
  runtime.install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version
      window.location.reload();
    },

    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
}
