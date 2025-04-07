import { call, put, takeLatest } from 'redux-saga/effects';
import { REQUEST_GET_NOTIFICATION_LIST, MARK_ALL_AS_READ } from './constants';
import { MARK_NOTIFICATION_AS_READ } from './constants';
import {
  requestNotificationsSuccess,
  requestSuccess,
  requestError,
} from './actions';

import {
  getNotifications,
  updateNotificationsAsRead,
  markNotificationAsRead,
} from 'utils/api';

export function* requestNotificationsSaga(action = {}) {
  const page = action.page ? action.page : '';
  const readed = action.readed;
  const params = {};
  if (readed !== null) {
    params.readed = readed;
  }

  try {
    const request = yield call(getNotifications, {
      method: 'get',
      page,
      params,
    });
    yield put(requestNotificationsSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* updateNotificationsAsReadSaga() {
  const options = { method: 'put' };

  try {
    yield call(updateNotificationsAsRead, options); 
    yield put(requestSuccess());

    yield put(getNotifications());
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* markNotificationAsReadSaga({ id, setToRead }) {
  const options = {
    method: 'put',
    data: { read: setToRead },
  };

  try {
    yield call(markNotificationAsRead, id, options);

    yield put({
      type: 'MARK_NOTIFICATION_AS_READ',
      id,
      setToRead,
    });
    yield put(requestSuccess());
  } catch (e) {
    yield put(requestError(e.message));
  }
}


export default function* appSaga() {
  yield takeLatest(REQUEST_GET_NOTIFICATION_LIST, requestNotificationsSaga);
  yield takeLatest(MARK_ALL_AS_READ, updateNotificationsAsReadSaga);
  yield takeLatest(MARK_NOTIFICATION_AS_READ, markNotificationAsReadSaga);
}
