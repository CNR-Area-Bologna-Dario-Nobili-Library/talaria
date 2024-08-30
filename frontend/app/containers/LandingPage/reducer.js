/*
 *
 * permission box reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  STOP_LOADING,
  REQUEST_ACCEPT_PERMISSION,
  REQUEST_ACCEPT_PERMISSION_SUCCESS,
  REQUEST_ACCEPT_PERMISSION_FAIL,
  REQUEST_REJECT_PERMISSION,
  REQUEST_REJECT_PERMISSION_SUCCESS,
  REQUEST_REJECT_PERMISSION_FAIL,
  REQUEST_GET_LIBRARY_OPTIONLIST,
  REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_OPTIONLIST_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: null,

  libraryList: {
    loading: false,
    data: [],
    pagination: {},
  },
};

/* eslint-disable default-case, no-param-reassign */
const permissionboxReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;

      case REQUEST_ACCEPT_PERMISSION:
        draft.loading = true;
        draft.error = null;
        break;
      case REQUEST_ACCEPT_PERMISSION_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        break;
      case REQUEST_ACCEPT_PERMISSION_FAIL:
        draft.loading = false;
        draft.error = initialState.error;
        break;

      case REQUEST_REJECT_PERMISSION:
        draft.loading = true;
        draft.error = initialState.error;
        break;
      case REQUEST_REJECT_PERMISSION_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        break;
      case REQUEST_REJECT_PERMISSION_FAIL:
        draft.loading = false;
        draft.error = initialState.error;
        break;

      case REQUEST_GET_LIBRARY_OPTIONLIST:
        draft.loading = true;
        draft.error = initialState.error;
        break;
      case REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.libraryList = action.result.map(item => {
          return { value: item.id, label: item.name, lon: item.lon, lat: item.lat, address:item.address, email:item.ill_email };
        });
        break;
      case REQUEST_GET_LIBRARY_OPTIONLIST_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;

      case REQUEST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        break;
      case STOP_LOADING:
        draft.loading = false;
        break;
      case REQUEST_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default permissionboxReducer;
