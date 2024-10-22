import { DEFAULT_ACTION } from '../LandingPage/constants';

import {
  REQUEST_ACCEPT_PERMISSION,
  REQUEST_ACCEPT_PERMISSION_SUCCESS,
  REQUEST_ACCEPT_PERMISSION_FAIL,
  REQUEST_REJECT_PERMISSION,
  REQUEST_REJECT_PERMISSION_SUCCESS,
  REQUEST_REJECT_PERMISSION_FAIL,  
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  STOP_LOADING,
} from '../LandingPage/constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const requestAcceptPermission = (id, status,acceptedMessage) => ({
  type: REQUEST_ACCEPT_PERMISSION,
  id,
  status,
  acceptedMessage,
});

export const requestAcceptPermissionSuccess = result => ({
  type: REQUEST_ACCEPT_PERMISSION_SUCCESS,
  result,
});

export const requestAcceptPermissionFail = error => ({
  type: REQUEST_ACCEPT_PERMISSION_FAIL,
});

export const requestRejectPermission = (id, status,rejectedMessage) => ({
  type: REQUEST_REJECT_PERMISSION,
  id,
  status,
  rejectedMessage
});

export const requestRejectPermissionSuccess = ressourceid => ({
  type: REQUEST_REJECT_PERMISSION_SUCCESS,
  ressourceid,
});

export const requestRejectPermissionFail = error => ({
  type: REQUEST_REJECT_PERMISSION_FAIL,
});



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
