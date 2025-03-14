/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */


export const REQUEST_GET_NOTIFICATION_LIST = 'app/App/REQUEST_GET_NOTIFICATION_LIST';
export const REQUEST_GET_NOTIFICATION_LIST_SUCCESS = 'app/App/REQUEST_GET_NOTIFICATION_LIST_SUCCESS';

export const REQUEST_GET_NOTIFICATION = 'app/App/REQUEST_GET_NOTIFICATION';
export const REQUEST_GET_NOTIFICATION_SUCCESS = 'app/App/REQUEST_GET_NOTIFICATION_SUCCESS';
export const REQUEST_CLEAR_NOTIFICATION_LIST = 'app/App/REQUEST_CLEAR_NOTIFICATION_LIST';

export const MARK_ALL_AS_READ = 'app/App/MARK_ALL_AS_READ';

export const REQUEST_SUCCESS = 'app/App/REQUEST_SUCCESS';
export const REQUEST_ERROR = 'app/App/REQUEST_ERROR';