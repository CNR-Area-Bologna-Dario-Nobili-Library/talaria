import { call, put, takeLatest } from 'redux-saga/effects';
import { REQUEST_GET_NOTIFICATION_LIST, MARK_ALL_AS_READ } from './constants';
import { MARK_NOTIFICATION_AS_READ, DELETE_NOTIFICATION, DELETE_NOTIFICATIONS_BULK } from './constants';
import {
  requestNotificationsSuccess,
  requestSuccess,
  requestError,
} from './actions';

import {
  getNotifications,
  updateNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
  deleteNotificationsBulk,
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
    if (typeof window !== 'undefined') {
      window.__SUPPRESS_NOTIF_TOAST = true;
    }

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

export function* deleteNotificationSaga({ id }) {
  try {
    yield call(deleteNotification, id);
    yield put(requestSuccess());
    yield put({ type: REQUEST_GET_NOTIFICATION_LIST }); // Refresh list
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* deleteAllNotificationsSaga() {
  try {
    yield call(deleteAllNotifications);
    yield put(requestSuccess());
    // Clear local state and refresh
    yield put({ type: REQUEST_GET_NOTIFICATION_LIST });
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* deleteNotificationsBulkSaga({ ids }) {
  try {
    if (!ids || !ids.length) {
      throw new Error('No notifications selected.');
    }
    yield call(deleteNotificationsBulk, ids); // ✅ Correct function name
    yield put(requestSuccess());
    yield put({ type: REQUEST_GET_NOTIFICATION_LIST });
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export default function* appSaga() {
  yield takeLatest(REQUEST_GET_NOTIFICATION_LIST, requestNotificationsSaga);
  yield takeLatest(MARK_ALL_AS_READ, updateNotificationsAsReadSaga);
  yield takeLatest(MARK_NOTIFICATION_AS_READ, markNotificationAsReadSaga);
  yield takeLatest(DELETE_NOTIFICATION, deleteNotificationSaga); 
  yield takeLatest(DELETE_NOTIFICATIONS_BULK, deleteNotificationsBulkSaga);
}
