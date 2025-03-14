/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import { persitanceMiddleWare, persistanceSaga } from './persistence';
import authProviderSaga from './containers/Auth/AuthProvider/saga';
import patronSaga from './containers/Patron/saga';
import referenceSaga from './containers/Reference/saga';
import adminSaga from './containers/Admin/saga';
import librarySaga from './containers/Library/saga';
import libraryregSaga from './containers/RegisterLibrary/saga'
import OASearchReference from './containers/OASearchReference/saga'
import DownloadFileSaga from './containers/FileDownload/saga'
import permissionboxSaga from './containers/LandingPage/saga'

import appSaga from './containers/App/saga';

export default function configureStore(initialState = {}, history) {
  let composeEnhancers = compose;
  const reduxSagaMonitorOptions = {};

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});

    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    // if (window.__SAGA_MONITOR_EXTENSION__)
    //   reduxSagaMonitorOptions = {
    //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
    //   };
    /* eslint-enable */
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware(history), persitanceMiddleWare];

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    createReducer(), //persistedReducer,
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  sagaMiddleware.run(persistanceSaga);
  sagaMiddleware.run(authProviderSaga);
  sagaMiddleware.run(patronSaga);
  sagaMiddleware.run(OASearchReference);
  sagaMiddleware.run(referenceSaga);
  sagaMiddleware.run(adminSaga);
  sagaMiddleware.run(librarySaga);
  sagaMiddleware.run(libraryregSaga);
  sagaMiddleware.run(permissionboxSaga);
  
  sagaMiddleware.run(DownloadFileSaga)
  sagaMiddleware.run(appSaga);
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {

      store.replaceReducer(() => {
        //const redu = persistReducer(persistConfig, createReducer(store.injectedReducers));
        const redu = createReducer(store.injectedReducers);
        //store.persistore.persist();
        return redu;
      });
    });
  }

  return { store };
}
