import { call, put, takeLatest } from 'redux-saga/effects';
import { REQUEST_USERS_LIST, REQUEST_UPDATE_USER,
          REQUEST_POST_USER, REQUEST_USER, REQUEST_GET_LIBRARY,
          REQUEST_USERS_OPTIONLIST,
          REQUEST_GET_ROLES,
          REQUEST_GET_LIBRARIES_LIST,
          REQUEST_UPDATE_LIBRARY,
          REQUEST_POST_LIBRARY,
          REQUEST_GET_INSTITUTION_TYPE_LIST,
          REQUEST_GET_PROJECT,
          REQUEST_GET_PROJECTS_LIST,
          REQUEST_UPDATE_PROJECT,
          REQUEST_POST_PROJECT,
          REQUEST_GET_INSTITUTIONS_LIST,
          REQUEST_GET_INSTITUTION,
          REQUEST_INSTITUTIONSTYPES_OPTIONLIST,
          REQUEST_POST_INSTITUTION,
          REQUEST_GET_COUNTRIES_OPTIONLIST,
          UPDATE_INSTITUTION,
          REQUEST_LIBRARYSUBJECT_OPTIONLIST,
          REQUEST_POST_PUBLIC_LIBRARY
} from './constants';
import {
  requestError,
  stopLoading,
  requestSuccess,
  requestUsersListSuccess,
  requestUserSuccess,
  requestUsersOptionListSuccess,
  requestGetLibrarySuccess,
  requestGetLibrariesListSuccess,
  requestGetInstitutionTypeListSuccess,
  requestGetProjectSuccess,
  requestGetProjectsListSuccess,
  requestGetInstitutionsListSuccess,
  requestGetInstitutionTypeOptionListSuccess,
  requestGetCountriesOptionListSuccess,
  requestGetInstitutionSuccess,
  requestGetRolesSuccess,
  requestLibrarySubjectOptionListSuccess
} from './actions';
import { toast } from "react-toastify";
import { push } from 'connected-react-router';
import {getUsersList, updateUser, createUser, getUsersOptionsList,
        getRoles, getUser, getLibrary, getLibrariesList, updateLibrary,
        createLibrary, getInstituionTypeList, getInstitutionsList,
        getInstitution, updateInstitution, getInstitutionTypesOptionList,
        createInstitution, getCountriesOptionsList,
        getProject, getProjectsList, updateProject,
        createProject, getLibrariesSubjects,createPublicLibrary} from 'utils/api'


export function* requestUserSaga(action) {
  const options = {
    method: 'get',
    id: action.id
  };
  try {
   const request = yield call(getUser, options);
   yield put(requestUserSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}


export function* requestUsersListSaga(action = {}) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1',
    query: action.query ? action.query : ''
  };
  try {
    const request = yield call(getUsersList, options);
    yield put(requestUsersListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateUserSaga(action) {
  const options = {
    method: 'put',
    body: action.request
  };
  try {
    const request = yield call(updateUser, options);
    yield call(requestUsersListSaga);
    yield put(push("/admin/users"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostUserSaga(action) {
  const options = {
    method: 'post',
    body: action.request
  };
  try {
    const request = yield call(createUser, options);
    yield call(requestUsersListSaga);
    yield put(push("/admin/users"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestUsersOptionListSaga(action) {
  const options = {
    method: 'get',
    query: action.request ? action.request : ""
  }
  try {
    const request = yield call(getUsersOptionsList, options);
    yield put(requestUsersOptionListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetRolesSaga() {
  const options = {
    method: 'get'
  };
  try {
   const request = yield call(getRoles, options);
   yield put(requestGetRolesSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostLibrarySaga(action) {
  console.log(action)
  const options = {
    method: 'post',
    body: {...action.request }
  };
  try {
    const request = yield call(createLibrary, options);
    yield call(requestGetLibrariesListSaga);
    yield put(push("/admin/libraries"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostPublicLibrarySaga(action) {
  const options = {
    method: 'post',
    body: {...action.request }
  };
  try {
    const request = yield call(createPublicLibrary, options);
    // yield call(requestGetLibrariesListSaga);
    yield put(push("/"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetLibrarySaga(action) {
  const options = {
    method: 'get',
    id: action.id
  };
  try {
   const request = yield call(getLibrary, options);
   yield put(requestGetLibrarySuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateLibrarySaga(action) {
  const options = {
    method: 'put',
    body: action.request
  };
  try {
    const request = yield call(updateLibrary, options);
    yield call(requestGetLibrariesListSaga);
    yield put(push("/admin/libraries"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetLibrariesListSaga(action = {}) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1',
    query: action.query ? action.query : ''
  };
  try {
    const request = yield call(getLibrariesList, options);
    yield put(requestGetLibrariesListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetInstitutionTypeListSaga(action = {}) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1'
  };
  try {
    const request = yield call(getInstituionTypeList, options);
    yield put(requestGetInstitutionTypeListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetInstitutionsListSaga(action = {}) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1',
    query: action.query ? action.query : ''
  };
  try {
    const request = yield call(getInstitutionsList, options);
    yield put(requestGetInstitutionsListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetInstitutionSaga(action) {
  const options = {
    method: 'get',
    id: action.id
  };
  try {
   const request = yield call(getInstitution, options);
   yield put(requestGetInstitutionSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestInstitutionTypeOptionListSaga(action) {
  const options = {
    method: 'get',
    query: action.request ? action.request : ""
  }
  try {
    const request = yield call(getInstitutionTypesOptionList, options);
    yield put(requestGetInstitutionTypeOptionListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateInstitutionSaga(action) {
  const options = {
    method: 'put',
    body: action.request
  };
  try {
    // console.log(action)
    const request = yield call(updateInstitution, options);
    yield call(requestGetInstitutionsListSaga);
    yield put(push("/admin/institutions"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetCountriesOptionListSaga(action) {
  const options = {
    method: 'get',
    query: action.request
  }
  try {
    const request = yield call(getCountriesOptionsList, options);
    yield put(requestGetCountriesOptionListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestLibrarySubjectOptionListSaga(action) {
  const options = {
    method: 'get',
    query: action.request ? action.request : ""
  }
  try {
    const request = yield call(getLibrariesSubjects, options);
    yield put(requestLibrarySubjectOptionListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostInstitutionSaga(action) {
  const options = {
    method: 'post',
    body: action.request
  };
  try {
    const request = yield call(createInstitution, options);
    yield call(requestGetInstitutionsListSaga)
    yield put(push("/admin/institutions"))
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostProjectSaga(action) {
  const options = {
    method: 'post',
    body: {...action.request }
  };
  try {
    const request = yield call(createProject, options);
    yield call(requestGetProjectsListSaga);
    yield put(push("/admin/projects"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetProjectSaga(action) {
  const options = {
    method: 'get',
    id: action.id
  };
  try {
   const request = yield call(getProject, options);
   yield put(requestGetProjectSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateProjectSaga(action) {
  const options = {
    method: 'put',
    body: action.request
  };
  try {
    const request = yield call(updateProject, options);
    yield call(requestGetProjectsListSaga);
    yield put(push("/admin/projects"));
    yield call(() => toast.success(action.message))
  } catch(e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetProjectsListSaga(action = {}) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1'
  };
  try {
    const request = yield call(getProjectsList, options);
    yield put(requestGetProjectsListSuccess(request));
  } catch(e) {
    yield put(requestError(e.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* adminSaga() {
  yield takeLatest(REQUEST_USERS_LIST, requestUsersListSaga);
  yield takeLatest(REQUEST_UPDATE_USER, requestUpdateUserSaga);
  yield takeLatest(REQUEST_POST_USER, requestPostUserSaga);
  yield takeLatest(REQUEST_USER, requestUserSaga);
  yield takeLatest(REQUEST_USERS_OPTIONLIST, requestUsersOptionListSaga);
  yield takeLatest(REQUEST_GET_ROLES, requestGetRolesSaga);
  yield takeLatest(REQUEST_GET_LIBRARY, requestGetLibrarySaga);
  yield takeLatest(REQUEST_GET_LIBRARIES_LIST, requestGetLibrariesListSaga);
  yield takeLatest(REQUEST_UPDATE_LIBRARY, requestUpdateLibrarySaga);
  yield takeLatest(REQUEST_POST_LIBRARY, requestPostLibrarySaga);
  yield takeLatest(REQUEST_POST_PUBLIC_LIBRARY, requestPostPublicLibrarySaga);
  yield takeLatest(REQUEST_GET_INSTITUTION_TYPE_LIST, requestGetInstitutionTypeListSaga);
  yield takeLatest(REQUEST_GET_PROJECT, requestGetProjectSaga);
  yield takeLatest(REQUEST_GET_PROJECTS_LIST, requestGetProjectsListSaga);
  yield takeLatest(REQUEST_UPDATE_PROJECT, requestUpdateProjectSaga);
  yield takeLatest(REQUEST_POST_PROJECT, requestPostProjectSaga);
  yield takeLatest(REQUEST_GET_INSTITUTIONS_LIST, requestGetInstitutionsListSaga);
  yield takeLatest(REQUEST_INSTITUTIONSTYPES_OPTIONLIST, requestInstitutionTypeOptionListSaga);
  yield takeLatest(REQUEST_LIBRARYSUBJECT_OPTIONLIST, requestLibrarySubjectOptionListSaga);
  yield takeLatest(REQUEST_GET_INSTITUTION, requestGetInstitutionSaga);
  yield takeLatest(REQUEST_POST_INSTITUTION, requestPostInstitutionSaga);
  yield takeLatest(REQUEST_GET_COUNTRIES_OPTIONLIST, requestGetCountriesOptionListSaga);
  yield takeLatest(UPDATE_INSTITUTION, requestUpdateInstitutionSaga);
}
