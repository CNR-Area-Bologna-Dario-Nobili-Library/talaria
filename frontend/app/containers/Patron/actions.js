/*
 *
 * Patron actions
 *
 */

import {DEFAULT_ACTION, REQUEST_MY_LIBRARIES, REQUEST_MY_LIBRARIES_SUCCESS,
  REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST,REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_OPTIONLIST, REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS, 
  REQUEST_ACCESS_TO_LIBRARIES,REQUEST_DELETE_ACCESS_TO_LIBRARIES,
  REQUEST_UPDATE_ACCESS_TO_LIBRARIES,
  REQUEST_REFERENCES_LIST, REQUEST_REFERENCES_LIST_SUCCESS, 
  REQUEST_REQUESTS_LIST, REQUEST_REQUESTS_LIST_SUCCESS,
  REQUEST_GET_REQUEST, REQUEST_GET_REQUEST_SUCCESS, 
  REQUEST_UPDATE_REQUEST,REQUEST_ARCHIVE_REQUEST,
  REQUEST_POST_REQUEST,
  REQUEST_CHANGE_STATUS_REQUEST,
  REQUEST_POST_REFERENCES, REQUEST_SUCCESS,
  REQUEST_UPDATE_REFERENCES, 
  REQUEST_POST_LABEL,
  REQUEST_UPDATE_LABEL,
  REQUEST_REMOVE_LABEL,
  REQUEST_POST_GROUP,
  REQUEST_UPDATE_GROUP,
  REQUEST_REMOVE_GROUP,
  REQUEST_GET_LIBRARY_DELIVERIES,
  REQUEST_GET_LIBRARY_DELIVERIES_SUCCESS,
  REQUEST_GET_MY_LIBRARY, REQUEST_GET_MY_LIBRARY_SUCCESS,
  REQUEST_GET_LABELS_OPTIONLIST,REQUEST_GET_LABELS_OPTIONLIST_SUCCESS,
  REQUEST_GET_GROUPS_OPTIONLIST,REQUEST_GET_GROUPS_OPTIONLIST_SUCCESS,
  REQUEST_REMOVE_REFERENCE_LABEL,REQUEST_REMOVE_REFERENCE_GROUP,
  REQUEST_APPLY_LABELS_TO_REFERENCES,REQUEST_APPLY_GROUPS_TO_REFERENCES,
  REQUEST_DELETE_REFERENCE,
  REQUEST_ERROR, STOP_LOADING,
  /*REQUEST_FIND_REFERENCE_BY_DOI,
  REQUEST_FIND_REFERENCE_BY_DOI_SUCCESS,
  REQUEST_FIND_REFERENCE_BY_PMID,
  REQUEST_FIND_REFERENCE_BY_PMID_SUCCESS,*/  
  REQUEST_FIND_UPDATE_OA,
  REQUEST_FIND_UPDATE_OA_SUCCESS,
  REQUEST_FIND_UPDATE_OA_FAIL,
  REQUEST_SEARCH_PLACES_BY_TEXT,
  REQUEST_SEARCH_PLACES_BY_TEXT_SUCCESS,
  REQUEST_SEARCH_PLACES_BY_TEXT_FAIL,
  REQUEST_GET_LIBRARY_LIST,
  REQUEST_GET_LIBRARY_LIST_SUCCESS,
  REQUEST_GET_TITLES_OPTIONLIST,
  REQUEST_GET_TITLES_OPTIONLIST_SUCCESS,

} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function requestUpdateReferences(request, id, message) {
  return {
    type: REQUEST_UPDATE_REFERENCES,
    request,
    id,
    message
  };
}

export function requestPostReferences(request, message) {
  return {
    type: REQUEST_POST_REFERENCES,
    request,
    message
  };
}

export function requestReferencesList(page, pageSize, query) {
  return {
    type: REQUEST_REFERENCES_LIST,
    page,
    query,
    pageSize
  };
}

export function requestReferencesListSuccess(result) {
  return {
    type: REQUEST_REFERENCES_LIST_SUCCESS,
    result
  };
}

export function requestRequestsList(page, pageSize, query) {
  return {
    type: REQUEST_REQUESTS_LIST,
    page,
    query,
    pageSize
  };
}

export function requestRequestsListSuccess(result) {
  return {
    type: REQUEST_REQUESTS_LIST_SUCCESS,
    result
  };
}

export function requestGetRequest(id) {
  return {
    type: REQUEST_GET_REQUEST,
    id,
  };
}

export function requestUpdateRequest(request, id, message) {
  return {
    type: REQUEST_UPDATE_REQUEST,
    request,
    id,
    message
  };
}

export function requestArchiveRequest(id, message,filter) {
  return {
    type: REQUEST_ARCHIVE_REQUEST,
    id,
    message,
    filter
  };
}


export function requestPostRequest(request, message) {
  return {
    type: REQUEST_POST_REQUEST,
    request,
    message
  };
}

export function requestChangeStatusRequest(id,status, message,filter) {
  return {
    type: REQUEST_CHANGE_STATUS_REQUEST,
    id,
    status,
    message,
    filter
  };
}

export function requestGetRequestSuccess(result) {
  return {
    type: REQUEST_GET_REQUEST_SUCCESS,
    result,
  };
}


export function requestGetMyLibrary(id) {
  return {
    type: REQUEST_GET_MY_LIBRARY,
    id
  };
}

export function requestGetMyLibrarySuccess(result) {
  return {
    type: REQUEST_GET_MY_LIBRARY_SUCCESS,
    result
  };
}

export function requestMyLibraries(page, query) {
  return {
    type: REQUEST_MY_LIBRARIES,
    page,
    query
  };
}

export function requestMyLibrariesSuccess(result) {
  return {
    type: REQUEST_MY_LIBRARIES_SUCCESS,
    result
  };
}

export function requestMyActiveLibrariesOptionList() {
  return {
    type: REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST
  };
}

export function requestMyActiveLibrariesOptionListSuccess(result) {
  return {
    type: REQUEST_MY_ACTIVE_LIBRARIES_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestLibraryOptionList(query) {
  return {
    type: REQUEST_GET_LIBRARY_OPTIONLIST,
    query
  };
}

export function requestLibraryOptionListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestUpdateAccessToLibrary(request) {
  return {
    type: REQUEST_UPDATE_ACCESS_TO_LIBRARIES,
    request,
    message: request.message
  };
}


export function requestAccessToLibrary(request) {
  return {
    type: REQUEST_ACCESS_TO_LIBRARIES,
    request,
    message: request.message
  };
}

export function requestDeleteAccessToLibrary(id,library_id,message) {
  return {
    type: REQUEST_DELETE_ACCESS_TO_LIBRARIES,
    id,
    library_id,
    message
  };
}

export function requestGetLibraryDeliveries(id) {
  return {
    type: REQUEST_GET_LIBRARY_DELIVERIES,
    id,
  };
}

export function requestGetLibraryDeliveriesSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_DELIVERIES_SUCCESS,
    result,
  };
}




export function requestLabelsOptionList(query) {
  return {
    type: REQUEST_GET_LABELS_OPTIONLIST,
    query
  };
}

export function requestGetLibraryListNearTo(pos) {
  return {
    type: REQUEST_GET_LIBRARY_LIST,
    pos
  };
}

export function requestGetLibraryListNearToSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_LIST_SUCCESS,
    result
  };
}

export function requestPostLabel( label_name, message) {
  return {
    type: REQUEST_POST_LABEL,
    label_name,
    message
  };
}

export function requestUpdateLabel(label_id, label_value, message) {
  return {
    type: REQUEST_UPDATE_LABEL,
    label_id,
    label_value,
    message
  };
}

export function requestRemoveLabel(label_id, message) {
  return {
    type: REQUEST_REMOVE_LABEL,
    label_id,
    message
  };
}

export function requestPostGroup( group_name, message) {
  return {
    type: REQUEST_POST_GROUP,
    group_name,
    message
  };
}

export function requestUpdateGroup(group_id, group_value, message) {
  return {
    type: REQUEST_UPDATE_GROUP,
    group_id,
    group_value,
    message
  };
}

export function requestRemoveGroup(group_id, message) {
  return {
    type: REQUEST_REMOVE_GROUP,
    group_id,
    message
  };
}


export function requestLabelsOptionListSuccess(result) {
  return {
    type: REQUEST_GET_LABELS_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestGroupsOptionList(query) {
  return {
    type: REQUEST_GET_GROUPS_OPTIONLIST,
    query
  };
}

export function requestGroupsOptionListSuccess(result) {
  return {
    type: REQUEST_GET_GROUPS_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestRemoveReferenceLabel(id,labelId,message, filter) {
  return {
    type: REQUEST_REMOVE_REFERENCE_LABEL,
    id,
    labelId,
    message,
    filter
  };
}

export function requestRemoveReferenceGroup(id,groupId,message, filter) {
  return {
    type: REQUEST_REMOVE_REFERENCE_GROUP,
    id,
    groupId,
    message,
    filter
  };
}

export function requestApplyLabelsToReferences(refIds,labelIds,message, refreshRef = false) {
  return {
    type: REQUEST_APPLY_LABELS_TO_REFERENCES,
    refIds,
    labelIds,
    message,
    refreshRef
  };
}

export function requestApplyGroupsToReferences(refIds,groupIds,message,  refreshRef = false) {
  return {
    type: REQUEST_APPLY_GROUPS_TO_REFERENCES,
    refIds,
    groupIds,
    message,
    refreshRef
  };
}

export function requestDeleteReference(id,message,filter) {
  return {
    type: REQUEST_DELETE_REFERENCE,
    id,
    message,
    filter
  };
}


/* External request actions */
export function requestFindReferenceByDOI(doi) {
  return {
    type: REQUEST_FIND_REFERENCE_BY_DOI,
    doi
  };
}

export function requestFindReferenceByDOISuccess(result) {
  return {
    type: REQUEST_FIND_REFERENCE_BY_DOI_SUCCESS,
    result
  };
}

export function requestFindReferenceByPMID(pmid) {
  return {
    type: REQUEST_FIND_REFERENCE_BY_PMID,
    pmid
  };
}

export function requestFindUpdateOA(id,data,foundMessage,notfoundMessage) {
  console.log("FINDandUpdateOA action")
  return {
    type: REQUEST_FIND_UPDATE_OA,
    id,
    data,
    foundMessage,
    notfoundMessage
  };
}

export function requestFindUpdateOAFail(result) {
  return {
    type: REQUEST_FIND_UPDATE_OA_FAIL,
    result
  };
}

export function requestFindUpdateOASuccess(result) {
  return {
    type: REQUEST_FIND_UPDATE_OA_SUCCESS,
    result
  };
}

export function requestFindReferenceByPMIDSuccess(result) {
  return {
    type: REQUEST_FIND_REFERENCE_BY_PMID_SUCCESS,
    result
  };
}

export function requestSearchPlacesByText(search) {
  return {
    type: REQUEST_SEARCH_PLACES_BY_TEXT,
    search
  };
}

export function requestSearchPlacesByTextSuccess(result) {
  return {
    type: REQUEST_SEARCH_PLACES_BY_TEXT_SUCCESS,
    result
  };
}

export function requestSearchPlacesByTextFail(error) {
  return {
    type: REQUEST_SEARCH_PLACES_BY_TEXT_FAIL,
    error
  };
}

export function requestGetTitlesOptionList(request) {
  return {
      type: REQUEST_GET_TITLES_OPTIONLIST,
      request
    };
  }
  
  export function requestGetTitlesOptionListSuccess(result) {
    return {
      type: REQUEST_GET_TITLES_OPTIONLIST_SUCCESS,
      result
    };
  }



/* END External request action */

/* export function requestAccessToLibrarySuccess(result) {
  return {
    type: REQUEST_ACCESS_TO_LIBRARIES_SUCCESS,
    result
  };
} */

export function requestSuccess() {
  return {
    type: REQUEST_SUCCESS,
  };
}

export function requestError(errorMessage) {
  return {
    type: REQUEST_ERROR,
    error: errorMessage
  };
}

export function stopLoading() {
  return {
    type: STOP_LOADING,
    // request: request
  };
}
