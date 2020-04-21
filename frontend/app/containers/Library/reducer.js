/*
 *
 * Library reducer
 *
 */
import produce from 'immer';
import {DEFAULT_ACTION, REQUEST_SUCCESS,
  REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
  REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS,
  REQUEST_USER, REQUEST_USER_SUCCESS,
  REQUEST_GET_LIBRARY, REQUEST_GET_LIBRARY_SUCCESS,
  REQUEST_GET_LIBRARIES_LIST, REQUEST_GET_LIBRARIES_LIST_SUCCESS,
  REQUEST_UPDATE_LIBRARY, REQUEST_POST_LIBRARY,
  REQUEST_POST_USER} from "./constants";

export const initialState = {
  loading: false,
  library: {},
  departmentOptionList: [],
  titleOptionList: [],
  usersList: {
    data: [],
    pagination: {}
  },
  error: null,
  user: {}
};

/* eslint-disable default-case, no-param-reassign */
const libraryReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case REQUEST_USERS_LIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_USERS_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.usersList.data = action.result.data.map(data => {
          return {
              created_at: data.created_at,
              library_name: data.library.data.name,
              user_name: data.user.data.full_name,
              id: data.id,
              user_id: data.user.data.id,
              status: data.status,
              department_id: data.department_id,
              department_name: data.department ?data.department.data.name:'',
              title_id: data.title_id,
              title_name: data.title? data.title.data.name:'',
              user_referent: data.user_referent,
              user_mat: data.user_mat,
              user_service_phone: data.user_service_phone,
              user_service_email: data.user_service_email,
            }
        })
        draft.usersList.pagination = action.result.meta.pagination
        break;
      case REQUEST_UPDATE_USER:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_UPDATE_USER_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.user = action.result.data
        break;
      case REQUEST_POST_USER:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_USER:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_USER_SUCCESS:
        draft.loading = false;
        draft.error = action.error;
        draft.user = action.result.data
        break;
      case REQUEST_POST_LIBRARY:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARY:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARY_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.library = action.result.data;
        draft.departmentOptionList = action.result.data.departments? action.result.data.departments.data.map(dep => {
            return {value: dep.id, label: dep.name}
        }):[]
        draft.titleOptionList = action.result.data.titles? action.result.data.titles.data.map(tit => {
          return {value: tit.id, label: tit.name}
        }):[]
        break;
      case REQUEST_UPDATE_LIBRARY:
        draft.loading = true;
        draft.error = action.error;
        break;
       case REQUEST_GET_LIBRARIES_LIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARIES_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.libraryOptionList = action.result.data
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

export default libraryReducer;
