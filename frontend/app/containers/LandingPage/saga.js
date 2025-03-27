import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { REQUEST_ACCEPT_PERMISSION, REQUEST_REJECT_PERMISSION, REQUEST_GET_LIBRARY_OPTIONLIST } from './constants';
import { toast } from 'react-toastify';

import {
  requestError,
  stopLoading,
  requestSuccess,
  requestRejectPermissionSuccess,
  requestAcceptPermissionSuccess,
} from './actions';

import { acceptRejectPermissionRequest } from 'utils/api';

export function* requestAcceptRejectPermissionSaga(action) {
  const { id, status,acceptedMessage,rejectedMessage } = action;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      status,
      id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = yield call(acceptRejectPermissionRequest, options);
    if (status === 1) {
      yield put(requestAcceptPermissionSuccess(response));
      yield call(() => toast.success(acceptedMessage));
    } else if (status === 2) {
      yield put(requestRejectPermissionSuccess(response));
      yield call(() => toast.success(rejectedMessage));
    }
  } catch (e) {
    yield put(requestError(e.message));
  }
}


/**
 * Library Registration saga
 */
export default function* permissionboxSaga() {
  yield takeEvery(REQUEST_ACCEPT_PERMISSION, requestAcceptRejectPermissionSaga);
  yield takeEvery(REQUEST_REJECT_PERMISSION, requestAcceptRejectPermissionSaga);

}
