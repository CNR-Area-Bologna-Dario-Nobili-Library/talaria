
import produce from "immer";
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { createSelector } from 'reselect';
// import { toggleDrawer } from 'containers/Sidebar/actions';
import { syncAuth, requestRefresh } from "containers/Auth/AuthProvider/actions";
import { setToken } from 'utils/api';
import {changeLocale} from './containers/LanguageProvider/actions';

// import { isMobileOrTablet } from 'utils/mobileDetector';
import { REQUEST_LOGIN, REQUEST_LOGOUT, REQUEST_LOGIN_SUCCESS, REQUEST_LOGOUT_SUCCESS, REQUEST_REFRESH_SUCCESS, REQUEST_SIGNUP_SUCCESS, REQUEST_PROFILE_SUCCESS, REQUEST_PERMISSIONS_SUCCESS, REQUEST_REFRESH, REQUEST_UPDATE_PROFILE_SUCCESS } from 'containers/Auth/AuthProvider/constants';
import {REQUEST_GET_LIBRARIES_LIST} from "./containers/Admin/constants";
import {REQUEST_GET_LIBRARY_DELIVERIES} from './containers/Patron/constants';
import {CHANGE_LOCALE} from './containers/LanguageProvider/constants';

// import { REQUEST_ILLNESS, REQUEST_PERCEPTION } from 'containers/SubmitPage/constants';

const SKIP_REFRESH = [
  REQUEST_REFRESH,
  REQUEST_LOGIN,
  REQUEST_LOGOUT,
  REQUEST_GET_LIBRARIES_LIST,
  REQUEST_GET_LIBRARY_DELIVERIES,
];
const SYNC_PERSISTANCE_REQUEST = "persitance/SYNC_PERSISTANCE_REQUEST";
const SYNC_PERSISTANCE_SUCCESS = "persitance/SYNC_PERSISTANCE_SUCCESS";

// import { requestIllness, requestPerception } from './containers/SubmitPage/actions';

const persistoreConfig = {
  id: "talaria",
  version: 1
}
export const persistore = {
  set: (key, draft) => {
    window.localStorage.setItem(`${persistoreConfig.id}-${persistoreConfig.version}-${key}`, JSON.stringify(draft));
  },
  get: (key) => {
    return JSON.parse(window.localStorage.getItem(`${persistoreConfig.id}-${persistoreConfig.version}-${key}`));
  },
  delete: (key) => {
    window.localStorage.removeItem(`${persistoreConfig.id}-${persistoreConfig.version}-${key}`)
  }
}

export function syncPersistanceRequest() {
  return {
    type: SYNC_PERSISTANCE_REQUEST,
  };
}

export function syncPersistanceSuccess() {
  return {
    type: SYNC_PERSISTANCE_SUCCESS,
  };
}

export const initialState = {
  loading: false,
  sync: false,
};

/* eslint-disable default-case, no-param-reassign */
export const persitanceReducer = (state = initialState, action) =>
  produce(state, ( draft ) => {
    switch (action.type) {
      case SYNC_PERSISTANCE_REQUEST:
          draft.loading = true;
          draft.sync = false;
        break;
      case SYNC_PERSISTANCE_SUCCESS:
          draft.loading = false;
          draft.sync = true;
        break;
    }
  });

export const persitanceMiddleWare = store => next => action => {
  // console.log('persitanceMiddleWare', store, next, action)
  if(action.type.includes("REQUEST_") && !action.type.includes("SUCCESS") && !action.type.includes("ERROR") && SKIP_REFRESH.indexOf(action.type) === -1 && !action.type.includes("_OPTIONLIST")) {
    store.dispatch(requestRefresh())
  }

  next(action);
  const state = store.getState();
  switch (action.type) {
    case REQUEST_LOGIN_SUCCESS:
    case REQUEST_REFRESH_SUCCESS:
    case REQUEST_SIGNUP_SUCCESS:
    case REQUEST_PERMISSIONS_SUCCESS:
    case REQUEST_PROFILE_SUCCESS:
    case REQUEST_UPDATE_PROFILE_SUCCESS:
      if(state.auth) {
        persistore.set("auth", state.auth);
      }
      break;
    case REQUEST_LOGOUT_SUCCESS:
        persistore.delete("auth");
      break;
    case CHANGE_LOCALE:      
      persistore.set("locale", state.locale);
      break;
  }
}

export function* refreshPersistance() {
  const authStore = persistore.get("auth");
  // console.log('refreshPersistance', authStore)
  if(authStore) {
    setToken(authStore.oauth.token);
    yield put(syncAuth(authStore))
  }

  //TODO (not working): apply language (read by storage)
  /*const loc=persistore.get("locale")
  if(loc)
    dispatch(changeLocale(loc));*/

  // if(isMobileOrTablet.any()) {
    // yield put(toggleDrawer())
  // }
  yield put(requestRefresh())
  // yield put(requestIllness())
  // yield put(requestPerception())
  yield put(syncPersistanceSuccess())
}

/**
 * Root saga manages watcher lifecycle
 */
export function* persistanceSaga() {
  // console.log('persistanceSaga')
  yield takeLatest(SYNC_PERSISTANCE_REQUEST, refreshPersistance);
}


const selectPersistanceDomain = state => state.persistence || initialState;


const makeSelectPersistance = () =>
  createSelector(
    selectPersistanceDomain,
    substate => substate,
  );

const isSync = () =>
  createSelector(
    selectPersistanceDomain,
    substate => substate.sync
  );

export default makeSelectPersistance;
export { isSync };
