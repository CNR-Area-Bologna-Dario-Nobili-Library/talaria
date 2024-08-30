import { DEFAULT_ACTION } from '../LandingPage/constants';

import {
  REQUEST_ACCEPT_PERMISSION,
  REQUEST_ACCEPT_PERMISSION_SUCCESS,
  REQUEST_ACCEPT_PERMISSION_FAIL,
  REQUEST_REJECT_PERMISSION,
  REQUEST_REJECT_PERMISSION_SUCCESS,
  REQUEST_REJECT_PERMISSION_FAIL,
  REQUEST_GET_LIBRARY_OPTIONLIST,
  REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_OPTIONLIST_FAIL,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  STOP_LOADING,
} from '../LandingPage/constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const requestAcceptPermission = (id, status) => ({
  type: REQUEST_ACCEPT_PERMISSION,
  id,
  status,
});

export const requestAcceptPermissionSuccess = result => ({
  type: REQUEST_ACCEPT_PERMISSION_SUCCESS,
  result,
});

export const requestAcceptPermissionFail = error => ({
  type: REQUEST_ACCEPT_PERMISSION_FAIL,
});

export const requestRejectPermission = (id, status) => ({
  type: REQUEST_REJECT_PERMISSION,
  id,
  status,
});

export const requestRejectPermissionSuccess = ressourceid => ({
  type: REQUEST_REJECT_PERMISSION_SUCCESS,
  ressourceid,
});

export const requestRejectPermissionFail = error => ({
  type: REQUEST_REJECT_PERMISSION_FAIL,
});

export function requestLibraryOptionList(query) {
  return {
    type: REQUEST_GET_LIBRARY_OPTIONLIST,
    query,
  };
}

export function requestLibraryOptionListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS,
    result,
  };
}

export function requestLibraryOptionListFail(query) {
  return {
    type: REQUEST_GET_LIBRARY_OPTIONLIST_FAIL,
    query,
  };
}



export function requestSuccess() {
  return {
    type: REQUEST_SUCCESS,
  };
}

export function requestError(errorMessage) {
  return {
    type: REQUEST_ERROR,
    error: errorMessage,
  };
}

export function stopLoading() {
  return {
    type: STOP_LOADING,
    // request: request
  };
}
