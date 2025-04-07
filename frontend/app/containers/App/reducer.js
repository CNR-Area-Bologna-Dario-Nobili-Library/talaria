import produce from 'immer';
// import moment from "moment";
import {
  REQUEST_GET_NOTIFICATION_LIST,
  REQUEST_GET_NOTIFICATION_LIST_SUCCESS,
  MARK_ALL_AS_READ,
  REQUEST_SUCCESS,
  REQUEST_CLEAR_NOTIFICATION_LIST,
  MARK_NOTIFICATION_AS_READ,
} from './constants';

export const initialState = {
  loading: false,
  notifications: {
    data: [],
    pagination: [],
    unreaded_total: 0,
  },
  error: null,
};

const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_GET_NOTIFICATION_LIST:
        draft.loading = true;
        draft.notifications.error = action.error;
        break;
      case REQUEST_GET_NOTIFICATION_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.notifications.data = action.result.data;
        draft.notifications.pagination = action.result.meta.pagination;
        draft.notifications.unreaded_total = action.result.meta.unreaded_total;
        break;
      case REQUEST_CLEAR_NOTIFICATION_LIST:
        // draft.loading = true;
        draft.error = action.error;
        draft.notifications.data = initialState.notifications.data;
        draft.notifications.pagination = initialState.notifications.pagination;
        draft.notifications.unreaded_total =
          initialState.notifications.unreaded_total;
        break;
      case MARK_ALL_AS_READ:
        const now = new Date().toISOString();
        draft.notifications.data.forEach(notification => {
          notification.read = true;
          notification.read_at = now;
        });
        break;
      case MARK_NOTIFICATION_AS_READ: {
        const notification = draft.notifications.data.find(
          n => n.id === action.id,
        );
        if (notification) {
          notification.read_at = action.setToRead
            ? new Date().toISOString()
            : null;
        }
        draft.notifications.unreaded_total = draft.notifications.data.filter(
          n => !n.read_at,
        ).length;
        break;
      }

      case REQUEST_SUCCESS:
        draft.loading = false;
        draft.notifications.error = initialState.error;
        break;
    }
  });

export default appReducer;
