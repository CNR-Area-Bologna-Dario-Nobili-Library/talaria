import { REQUEST_GET_NOTIFICATION_LIST, REQUEST_GET_NOTIFICATION_LIST_SUCCESS,
  REQUEST_GET_NOTIFICATION, REQUEST_GET_NOTIFICATION_SUCCESS, MARK_ALL_AS_READ,MARK_NOTIFICATION_AS_READ,
  REQUEST_ERROR, REQUEST_SUCCESS, REQUEST_CLEAR_NOTIFICATION_LIST, DELETE_NOTIFICATION
} from './constants';


 export function requestNotifications(page = "", readed = null) {
    return {
      type: REQUEST_GET_NOTIFICATION_LIST,
      page,
      readed,
    };
  }

  export function requestNotificationsSuccess(result) {
    return {
      type: REQUEST_GET_NOTIFICATION_LIST_SUCCESS,
      result
    };
  }

  export function clearNotifications() {
    return {
      type: REQUEST_CLEAR_NOTIFICATION_LIST
    };
  }

  export function requestNotification(id, setToRead) {
    return {
      type: REQUEST_GET_NOTIFICATION,
      id,
      setToRead
    };
  }
  
  export function requestNotificationSuccess(result) {
    return {
      type: REQUEST_GET_NOTIFICATION_SUCCESS,
      result
    };
  }
  
  export function updateNotificationsAsRead() {
    return {
      type: MARK_ALL_AS_READ,
    };
  }

  export function markNotificationAsRead(id, setToRead) {
      return {
      type: MARK_NOTIFICATION_AS_READ,
      id,
      setToRead, 
    };
  }

  export function upadteNotificationsAsRead() {
    return {
      type: MARK_ALL_AS_READ,
    };
  }

  export function deleteNotificationAction(id) {
    return {
      type: DELETE_NOTIFICATION,
      id,
    };
  }

  export function requestError(errorMessage) {
    return {
      type: REQUEST_ERROR,
      error: errorMessage
    };
  }

  export function requestSuccess() {
    return {
      type: REQUEST_SUCCESS,
    };
  }