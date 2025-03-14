import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
  fork,
  take,
} from 'redux-saga/effects';
import {
  REQUEST_MY_LIBRARIES,
  REQUEST_GET_LIBRARY_OPTIONLIST,
  REQUEST_ACCESS_TO_LIBRARIES,
  REQUEST_UPDATE_ACCESS_TO_LIBRARIES,
  REQUEST_DELETE_ACCESS_TO_LIBRARIES,
  REQUEST_REFERENCES_LIST,
  REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST,
  REQUEST_POST_REFERENCES,
  REQUEST_UPDATE_REFERENCES,
  REQUEST_UPDATE_REQUEST,
  REQUEST_ARCHIVE_REQUEST,
  REQUEST_CHANGE_STATUS_REQUEST,
  REQUEST_GET_LABELS_OPTIONLIST,
  REQUEST_GET_GROUPS_OPTIONLIST,
  REQUEST_UPDATE_LABEL,
  REQUEST_REMOVE_LABEL,
  REQUEST_POST_LABEL,
  REQUEST_POST_GROUP,
  REQUEST_REMOVE_GROUP,
  REQUEST_UPDATE_GROUP,
  REQUEST_GET_MY_LIBRARY,
  REQUEST_REMOVE_REFERENCE_LABEL,
  REQUEST_REMOVE_REFERENCE_GROUP,
  REQUEST_APPLY_LABELS_TO_REFERENCES,
  REQUEST_APPLY_GROUPS_TO_REFERENCES,
  REQUEST_REQUESTS_LIST,
  REQUEST_GET_REQUEST,
  REQUEST_DELETE_REFERENCE,
  REQUEST_GET_LIBRARY_DELIVERIES,
  REQUEST_POST_REQUEST,
  /*REQUEST_FIND_REFERENCE_BY_DOI, REQUEST_FIND_REFERENCE_BY_PMID,*/ REQUEST_FIND_UPDATE_OA,
  REQUEST_SEARCH_PLACES_BY_TEXT,
  REQUEST_GET_LIBRARY_LIST,
  REQUEST_GET_TITLES_OPTIONLIST,
} from './constants';
import {
  requestError,
  stopLoading,
  requestSuccess,
  requestMyLibrariesSuccess,
  requestMyActiveLibrariesOptionListSuccess,
  requestGetMyLibrarySuccess,
  /* requestGetLibraryList, */
  requestLibraryOptionListSuccess,
  requestLabelsOptionListSuccess,
  requestGroupsOptionListSuccess,
  requestReferencesListSuccess,
  requestReferencesList,
  requestRequestsListSuccess,
  requestRequestsList,
  requestGetRequestSuccess,
  requestGetLibraryDeliveriesSuccess,
  //requestFindReferenceByDOISuccess,
  //requestFindReferenceByPMIDSuccess,
  requestFindUpdateOASuccess,
  requestFindUpdateOAFail,
  requestSearchPlacesByTextSuccess,
  requestSearchPlacesByTextFail,
  requestGetLibraryListNearToSuccess,
  requestGetTitlesOptionListSuccess,
} from './actions';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import {
  getMyLibrary,
  getMyLibraries,
  getMyActiveLibrariesOptionList,
  getLibraryOptionList,
  requestAccessToLibrary,
  deleteAccessToLibrary,
  updateAccessToLibrary,
  getReferencesList,
  getRequestsList,
  createReference,
  updateReference,
  updateLabel,
  createLabel,
  deleteLabel,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteReference,
  getPatronRequest,
  updatePatronRequest,
  changeStatusPatronRequest,
  getLabelsOptionList,
  getGroupsOptionList,
  removeReferenceLabel,
  removeReferenceGroup,
  requestApplyLabelsToReferences,
  requestApplyGroupsToReferences,
  getLibraryDeliveries,
  createPatronRequest,
  getLibrariesListNearTo,
  getTitlesOptionsList,
} from 'utils/api';

import {
  getReferenceByDOI,
  getReferenceByPMID,
  getOA,
  getOAReferenceByID,
  getPlacesByText,
} from 'utils/apiExternal';

import { userPermissionsSaga } from '../Auth/AuthProvider/saga';
import { requestGetReferenceSaga } from '../Reference/saga';

export function* requestMyLibrariesSaga(action) {
  const options = {
    method: 'get',
    page: action && action.page ? action.page : '1',
    query: action && action.query ? action.query : '',
  };
  try {
    const request = yield call(getMyLibraries, options);
    yield put(requestMyLibrariesSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestMyActiveLibrariesOptionListSaga(action) {
  const options = {
    method: 'get',
    //page: action && action.page ? action.page : '1',
    //query: action && action.query ? action.query : ''
  };
  try {
    const request = yield call(getMyActiveLibrariesOptionList, options);
    yield put(requestMyActiveLibrariesOptionListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestLibraryOptionListSaga(action = {}) {
  const options = {
    method: 'get',
    query: action.query ? action.query : '',
  };
  try {
    const request = yield call(getLibraryOptionList, options);
    yield put(requestLibraryOptionListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestLibraryDeliveriesOptionListSaga(action = {}) {
  const options = {
    method: 'get',
    id: action.id,
  };
  try {
    const request = yield call(getLibraryDeliveries, options);
    yield put(requestGetLibraryDeliveriesSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestLabelsOptionListSaga(action = {}) {
  const options = {
    method: 'get',
  };
  try {
    const request = yield call(getLabelsOptionList, options);
    yield put(requestLabelsOptionListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestGroupsOptionListSaga(action = {}) {
  const options = {
    method: 'get',
  };
  try {
    const request = yield call(getGroupsOptionList, options);
    yield put(requestGroupsOptionListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestRemoveReferenceLabelSaga(action) {
  const options = {
    method: 'delete',
    id: action.id,
    labelId: action.labelId,
  };
  try {
    const request = yield call(removeReferenceLabel, options);
    !action.filter
      ? yield call(requestGetReferenceSaga, { id: action.id })
      : yield put(requestReferencesList(null, null, action.filter));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestRemoveReferenceGroupSaga(action) {
  const options = {
    method: 'delete',
    id: action.id,
    groupId: action.groupId,
  };
  try {
    const request = yield call(removeReferenceGroup, options);
    !action.filter
      ? yield call(requestGetReferenceSaga, { id: action.id })
      : yield put(requestReferencesList(null, null, action.filter));
    // yield put(push("/patron/references"));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}
export function* requestDeleteReferenceSaga(action) {
  const options = {
    method: 'delete',
    id: action.id,
  };
  try {
    const request = yield call(deleteReference, options);
    !action.filter
      ? yield put(push('/patron/references'))
      : yield put(requestReferencesList(null, null, action.filter));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostLabelSaga(action) {
  const options = {
    method: 'post',
    body: {
      name: action.label_name,
    },
  };
  try {
    const request = yield call(createLabel, options);
    yield call(requestLabelsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateLabelSaga(action) {
  const options = {
    method: 'put',
    label_id: action.label_id,
    body: {
      name: action.label_value,
    },
  };
  try {
    const request = yield call(updateLabel, options);
    yield call(requestLabelsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestRemoveLabelSaga(action) {
  const options = {
    method: 'delete',
    label_id: action.label_id,
  };
  try {
    const request = yield call(deleteLabel, options);
    yield call(requestLabelsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostGroupSaga(action) {
  const options = {
    method: 'post',
    body: {
      name: action.group_name,
    },
  };
  try {
    const request = yield call(createGroup, options);
    yield call(requestGroupsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateGroupSaga(action) {
  const options = {
    method: 'put',
    group_id: action.group_id,
    body: {
      name: action.group_value,
    },
  };
  try {
    const request = yield call(updateGroup, options);
    yield call(requestGroupsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestRemoveGroupSaga(action) {
  const options = {
    method: 'delete',
    group_id: action.group_id,
  };
  try {
    const request = yield call(deleteGroup, options);
    yield call(requestGroupsOptionListSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestApplyLabelsToReferencesSaga(action) {
  const options = {
    method: 'put',
    body: {
      references: action.refIds,
      labelIds: action.labelIds,
    },
  };

  try {
    const request = yield call(requestApplyLabelsToReferences, options);
    // se sei nella pagina del singolo riferimento non ricarichi la lista ma la pagina del singolo rif
    !action.refreshRef
      ? yield put(requestReferencesList())
      : yield call(requestGetReferenceSaga, { id: action.refIds.join() });
    // Callback dopo il Crea nuova etichetta
    if (action.labelIds.some(labelId => typeof labelId === 'string')) {
      yield call(requestLabelsOptionListSaga);
    }
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestApplyGroupsToReferencesSaga(action) {
  const options = {
    method: 'put',
    body: {
      references: action.refIds,
      groupIds: action.groupIds,
    },
  };
  try {
    const request = yield call(requestApplyGroupsToReferences, options);
    // se sei nella pagina del singolo riferimento non ricarichi la lista ma la pagina del singolo rif
    !action.refreshRef
      ? yield put(requestReferencesList())
      : yield call(requestGetReferenceSaga, { id: action.refIds.join() });
    // Callback dopo il Crea nuova etichetta
    if (action.groupIds.some(groupId => typeof groupId === 'string')) {
      yield call(requestGroupsOptionListSaga);
    }
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestAccessToLibrarySaga(action) {
  
  const options = {
    method: 'post',
    body: action.request,
    library_id: action.request.library_id,
    message: action.request.message
  };
  try {
    const request = yield call(requestAccessToLibrary, options);
    yield call(userPermissionsSaga); //update roles in user profiles
    yield call(requestMyLibrariesSaga);
    //yield put(push("/patron/my-libraries"))
    yield call(() => toast.success(action.request.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestDeleteAccessToLibrarySaga(action) {
  const options = {
    method: 'delete',
    body: {
      id: action.id,
      library_id: action.library_id,
    },
  };

  try {
    const request = yield call(deleteAccessToLibrary, options);
    yield call(requestMyLibrariesSaga);
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateAccessToLibrarySaga(action) {
  const options = {
    method: 'put',
    body: action.request,
    id: action.request.id,
    library_id: action.request.library_id,
    message: action.request.message
  };
  try {
    const noredirectToMyLibraries = options.body.noredirectToMyLibraries;
    const request = yield call(updateAccessToLibrary, options);
    yield call(requestMyLibrariesSaga);
    if (!noredirectToMyLibraries) yield put(push('/patron/my-libraries'));
    yield call(() => toast.success(action.request.message));
    // if (action.message) {
    //   yield call(() => toast.success(action.request.message));
    //}
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestReferencesListSaga(action) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1',
    query: action.query ? action.query : null,
    pageSize: action.pageSize ? action.pageSize : null,
  };
  try {
    console.log(action);
    const request = yield call(getReferencesList, options);
    yield put(requestReferencesListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestRequestsListSaga(action) {
  const options = {
    method: 'get',
    page: action.page ? action.page : '1',
    query: action.query ? action.query : null,
    pageSize: action.pageSize ? action.pageSize : null,
  };
  try {
    console.log(action);
    const request = yield call(getRequestsList, options);
    yield put(requestRequestsListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetRequestSaga(action) {
  const options = {
    method: 'get',
    id: action.id,
  };
  try {
    const request = yield call(getPatronRequest, options);
    yield put(requestGetRequestSuccess(request));
    // yield call(() => toast.success(action.message))
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateRequestSaga(action) {
  const options = {
    method: 'put',
    body: action.request,
    id: action.id,
  };
  try {
    const request = yield call(updatePatronRequest, options);
    yield put(requestRequestsList(null, null, action.filter));
    yield put(push('/patron/requests'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestArchiveRequestSaga(action) {
  const options = {
    method: 'put',
    body: { archived: 1 },
    id: action.id,
  };
  try {
    const request = yield call(updatePatronRequest, options);
    yield put(requestRequestsList(null, null, action.filter));
    yield put(push('/patron/requests'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestChangeStatusRequestSaga(action) {
  const options = {
    method: 'put',
    body: { status: action.status },
    id: action.id,
  };
  try {
    const request = yield call(changeStatusPatronRequest, options);
    yield put(requestRequestsList(null, null, action.filter));
    yield put(push('/patron/requests'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostRequestSaga(action) {
  const options = {
    method: 'post',
    body: action.request,
  };
  try {
    const request = yield call(createPatronRequest, options);
    yield put(requestRequestsList());
    yield put(push('/patron/requests'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestPostReferencesSaga(action) {
  const options = {
    method: 'post',
    body: action.request,
  };
  try {
    const request = yield call(createReference, options);
    yield put(requestReferencesList());
    yield put(push('/patron/references'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestUpdateReferenceSaga(action) {
  const options = {
    method: 'put',
    body: action.request,
    id: action.id,
  };
  try {
    const request = yield call(updateReference, options);
    yield put(requestReferencesList());
    yield put(push('/patron/references'));
    yield call(() => toast.success(action.message));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetMyLibrarySaga(action) {
  const options = {
    method: 'get',
    id: action.id,
  };
  try {
    const request = yield call(getMyLibrary, options);
    yield put(requestGetMyLibrarySuccess(request));
    // yield call(() => toast.success(action.message))
  } catch (e) {
    yield put(requestError(e.message));
  }
}

/**
 * External API
 */
/*export function* searchReferenceByDOISaga(action) {
  const options = {
    method: 'get',
    doi: action.doi
  }
  try {
    const request = yield call(getReferenceByDOI, options);
    //console.log("DOI OK",request)
    yield put(requestFindReferenceByDOISuccess(request));
    //yield put(push("/patron/references/import"));
  } catch(e) {
    console.log("DOI ERR",e)
    yield put(requestError(e.message));
  }
}

export function* searchReferenceByPMIDSaga(action) {
  const options = {
    method: 'get',
    pmid: action.pmid
  }
  try {
    const request = yield call(getReferenceByPMID, options);
    //console.log("PMID OK",request)
    yield put(requestFindReferenceByPMIDSuccess(request));
    //yield put(push("/patron/references/import"));
  } catch(e) {
    console.log("PMID ERR",e)
    yield put(requestError(e.message));
  }
}*/

//chiamare api x trovare OA e aggiornare (POST) il riferimento in modo che ricarichi la pag
//La ricerca OA avviene x titolo della pubb (puo' essere titolo part o titolo book/thesi/...)
export function* findUpdateOASaga(action) {
  console.log('FINDUPDATEOA_SAGA:', action);
  if (action.data && action.data != '') {
    const options = {
      method: 'get',
      refData: action.data,
    };
    try {
      const request = yield call(getOA, options);
      if (/*request.found &&*/ request.url) {
        console.log('TROVATO OA!:', request.url);
        //yield call(() => toast.success("Versione OA trovata!"))
        yield put(requestFindUpdateOASuccess(action.id));
        yield call(requestUpdateReferenceSaga, {
          id: action.id,
          request: { oa_link: request.url },
          message: action.foundMessage,
        });
      } else {
        console.log('NON TROVATO');
        yield put(requestFindUpdateOAFail(action.id));
        yield call(() => toast.error(action.notfoundMessage));
      }
    } catch (e) {
      console.log('OA FIND AND UPDATE ERROR', e);
      yield put(requestError(e.message));
      yield put(requestFindUpdateOAFail(action.id));
      yield call(() => toast.error(action.notfoundMessage));
    }
  } else {
    console.log('NON TROVATO-title mancante');
    yield put(requestFindUpdateOAFail(action.id));
    yield call(() => toast.error(action.notfoundMessage));
  }
}

export function* findPlacesByText(action) {
  console.log('findPlacesByText:', action);
  const options = {
    method: 'get',
    search: action.search,
  };
  try {
    const result = yield call(getPlacesByText, options);
    yield put(requestSearchPlacesByTextSuccess(result));
  } catch (e) {
    yield put(requestSearchPlacesByTextFail(e.message));
  }
}

export function* requestLibraryListNearToSaga(action = {}) {
  console.log('SAGA-requestLibraryListNearToSaga', action);
  const options = {
    method: 'get',
    pos: action.pos ? action.pos : '',
  };
  try {
    const request = yield call(getLibrariesListNearTo, options);
    yield put(requestGetLibraryListNearToSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

export function* requestGetTitlesOptionListSaga(action) {
  const options = {
    method: 'get',
    query: action.request,
  };
  try {
    const request = yield call(getTitlesOptionsList, options);
    yield put(requestGetTitlesOptionListSuccess(request));
  } catch (e) {
    yield put(requestError(e.message));
  }
}

//////////////////// END EXTERNAL API /////////////////

/**
 * Root saga manages watcher lifecycle
 */
export default function* patronSaga() {
  yield takeLatest(REQUEST_MY_LIBRARIES, requestMyLibrariesSaga);
  yield takeLatest(
    REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST,
    requestMyActiveLibrariesOptionListSaga,
  );
  yield takeLatest(
    REQUEST_GET_LIBRARY_OPTIONLIST,
    requestLibraryOptionListSaga,
  );
  yield takeLatest(REQUEST_GET_LABELS_OPTIONLIST, requestLabelsOptionListSaga);
  yield takeLatest(REQUEST_GET_GROUPS_OPTIONLIST, requestGroupsOptionListSaga);
  yield takeLatest(REQUEST_GET_MY_LIBRARY, requestGetMyLibrarySaga);
  yield takeLatest(REQUEST_ACCESS_TO_LIBRARIES, requestAccessToLibrarySaga);
  yield takeLatest(REQUEST_UPDATE_LABEL, requestUpdateLabelSaga);
  yield takeLatest(REQUEST_POST_LABEL, requestPostLabelSaga);
  yield takeLatest(REQUEST_REMOVE_LABEL, requestRemoveLabelSaga);
  yield takeLatest(REQUEST_POST_GROUP, requestPostGroupSaga);
  yield takeLatest(REQUEST_UPDATE_GROUP, requestUpdateGroupSaga);
  yield takeLatest(REQUEST_REMOVE_GROUP, requestRemoveGroupSaga);
  yield takeLatest(
    REQUEST_UPDATE_ACCESS_TO_LIBRARIES,
    requestUpdateAccessToLibrarySaga,
  );
  yield takeLatest(
    REQUEST_DELETE_ACCESS_TO_LIBRARIES,
    requestDeleteAccessToLibrarySaga,
  );
  yield takeLatest(REQUEST_REFERENCES_LIST, requestReferencesListSaga);
  yield takeLatest(REQUEST_POST_REFERENCES, requestPostReferencesSaga);
  yield takeLatest(REQUEST_UPDATE_REFERENCES, requestUpdateReferenceSaga);
  yield takeLatest(REQUEST_DELETE_REFERENCE, requestDeleteReferenceSaga);
  yield takeLatest(
    REQUEST_REMOVE_REFERENCE_LABEL,
    requestRemoveReferenceLabelSaga,
  );
  yield takeLatest(
    REQUEST_REMOVE_REFERENCE_GROUP,
    requestRemoveReferenceGroupSaga,
  );
  yield takeLatest(
    REQUEST_APPLY_LABELS_TO_REFERENCES,
    requestApplyLabelsToReferencesSaga,
  );
  yield takeLatest(
    REQUEST_APPLY_GROUPS_TO_REFERENCES,
    requestApplyGroupsToReferencesSaga,
  );
  yield takeLatest(REQUEST_REQUESTS_LIST, requestRequestsListSaga);
  yield takeLatest(REQUEST_GET_REQUEST, requestGetRequestSaga);
  yield takeLatest(REQUEST_UPDATE_REQUEST, requestUpdateRequestSaga);
  yield takeLatest(REQUEST_ARCHIVE_REQUEST, requestArchiveRequestSaga);
  yield takeLatest(REQUEST_POST_REQUEST, requestPostRequestSaga);
  yield takeLatest(
    REQUEST_CHANGE_STATUS_REQUEST,
    requestChangeStatusRequestSaga,
  );
  yield takeLatest(
    REQUEST_GET_LIBRARY_DELIVERIES,
    requestLibraryDeliveriesOptionListSaga,
  );
  yield takeLatest(
    REQUEST_GET_TITLES_OPTIONLIST,
    requestGetTitlesOptionListSaga,
  );
  /*yield takeLatest(REQUEST_FIND_REFERENCE_BY_DOI,searchReferenceByDOISaga);
  yield takeLatest(REQUEST_FIND_REFERENCE_BY_PMID,searchReferenceByPMIDSaga);*/

  yield takeEvery(REQUEST_FIND_UPDATE_OA, findUpdateOASaga);
  yield takeLatest(REQUEST_SEARCH_PLACES_BY_TEXT, findPlacesByText);
  yield takeLatest(REQUEST_GET_LIBRARY_LIST, requestLibraryListNearToSaga);
}
