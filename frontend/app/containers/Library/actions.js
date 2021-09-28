/*
 *
 * Library actions
 *
 */

import {DEFAULT_ACTION, REQUEST_SUCCESS,
   REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
   REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS, REQUEST_DELETE_USER,
   REQUEST_USER, REQUEST_USER_SUCCESS,
   REQUEST_GET_LIBRARY, REQUEST_GET_LIBRARY_SUCCESS,
   REQUEST_GET_LIBRARIES_LIST, REQUEST_GET_LIBRARIES_LIST_SUCCESS,
   REQUEST_UPDATE_LIBRARY, /* REQUEST_UPDATE_LIBRARY_SUCCESS, */
   REQUEST_POST_LIBRARY, REQUEST_POST_LIBRARY_SUCCESS,
   REQUEST_POST_USER, REQUEST_POST_USER_SUCCESS,
   REQUEST_BORROWINGS_LIST,REQUEST_BORROWINGS_LIST_SUCCESS,REQUEST_LENDINGS_LIST,REQUEST_LENDINGS_LIST_SUCCESS,
   REQUEST_GET_LIBRARY_TAGS_OPTIONLIST,REQUEST_GET_LIBRARY_TAGS_OPTIONLIST_SUCCESS,
   REQUEST_APPLY_TAGS_TO_DDREQUESTS,REQUEST_REMOVE_DDREQUEST_TAG,
   REQUEST_POST_LIBRARY_TAG,REQUEST_UPDATE_LIBRARY_TAG,REQUEST_REMOVE_LIBRARY_TAG, 
   REQUEST_POST_NEW_BORROWING,
   REQUEST_GET_BORROWING,REQUEST_GET_BORROWING_SUCCESS,
   REQUEST_UPDATE_BORROWING,
   REQUEST_UPDATE_BORROWING_SUCCESS,
   REQUEST_FIND_UPDATE_BORROWING_OA,
   REQUEST_FIND_UPDATE_BORROWING_OA_FAIL,
   REQUEST_FIND_UPDATE_BORROWING_OA_SUCCESS
  } from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function requestUsersList(library_id, page, query) {
  return {
    type: REQUEST_USERS_LIST,
    page,
    library_id,
    query
  };
}

export function requestUsersListSuccess(result) {
  return {
    type: REQUEST_USERS_LIST_SUCCESS,
    result
  };
}


export function requestUser(library_id, user_id) {
  return {
    type: REQUEST_USER,
    library_id,
    user_id
  };
}

export function requestUserSuccess(result) {
  return {
    type: REQUEST_USER_SUCCESS,
    result
  };
}

export function requestPostUser(request, message) {
  return {
    type: REQUEST_POST_USER,
    request,
    message
  };
}

export function requestUpdateUser(request) {
  return {
    type: REQUEST_UPDATE_USER,
    request
  };
}

export function requestDeleteUser(id,library_id,message) {
  return {
    type: REQUEST_DELETE_USER,
    id,
    library_id,
    message
  };
}

/* export function requestUpdateUserSuccess(result) {
  return {
    type: REQUEST_UPDATE_USER_SUCCESS,
    result
  };
} */

export function requestGetLibrariesList(page) {
  return {
    type: REQUEST_GET_LIBRARIES_LIST,
    page
  };
}

export function requestGetLibrariesListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARIES_LIST_SUCCESS,
    result
  };
}

export function requestPostLibrary(request, message) {
  return {
    type: REQUEST_POST_LIBRARY,
    request,
    message
  };
}

export function requestGetLibrary(id,includes) {
  return {
    type: REQUEST_GET_LIBRARY,
    id,
    includes
  };
}

export function requestGetLibrarySuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_SUCCESS,
    result
  };
}

export function requestUpdateLibrary(request, message) {
  return {
    type: REQUEST_UPDATE_LIBRARY,
    request,
    message
  };
}

export function requestLibraryTagsOptionList(library_id) {
  return {
    type: REQUEST_GET_LIBRARY_TAGS_OPTIONLIST,
    library_id
  };
}


export function requestRemoveDDRequestTag(library_id,id,tagId,message, filter) {
  return {
    type: REQUEST_REMOVE_DDREQUEST_TAG,
    id,
    tagId,
    message,
    filter,
    library_id
  };
}


export function requestApplyTagsToDDRequests(library_id,reqIds,tagIds,message) {
  return {
    type: REQUEST_APPLY_TAGS_TO_DDREQUESTS,
    reqIds,
    tagIds,
    message,
    library_id,
  };
}


export function requestLibraryTagsOptionListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_TAGS_OPTIONLIST_SUCCESS,
    result
  };
}
 
export function requestPostLibraryTag( library_id,tag_name, message) {
  return {
    type: REQUEST_POST_LIBRARY_TAG,
    tag_name,
    message,
    library_id
  };
}

export function requestUpdateLibraryTag(library_id,tag_id, tag_value, message) {
  return {
    type: REQUEST_UPDATE_LIBRARY_TAG,
    tag_id,
    tag_value,
    library_id,
    message
  };
}

export function requestRemoveLibraryTag(library_id,tag_id, message) {
  return {
    type: REQUEST_REMOVE_LIBRARY_TAG,
    tag_id,
    library_id,
    message
  };
}


export function requestBorrowingsList(library_id,page, pageSize, query) {
  return {
    type: REQUEST_BORROWINGS_LIST,
    library_id,
    page,
    query,
    pageSize
  };
}                

export function requestBorrowingsListSuccess(result) {
  return {
    type: REQUEST_BORROWINGS_LIST_SUCCESS,
    result
  };
}

export function requestLendingsList(library_id,page, pageSize, query) {
  return {
    type: REQUEST_LENDINGS_LIST,
    library_id,
    page,
    query,
    pageSize
  };
}

export function requestLendingsListSuccess(result) {
  return {
    type: REQUEST_LENDINGS_LIST_SUCCESS,
    result
  };
}

export function requestPostNewBorrowing(library_id,refData,message){
  return {
    type: REQUEST_POST_NEW_BORROWING,
    borrowing_library_id:library_id,
    reference: refData,    
    message,
  };
}


export function requestUpdateBorrowing(id,library_id,reqData,message){
  return {
    type: REQUEST_UPDATE_BORROWING,
    borrowing_library_id:library_id,
    borrowing: reqData,  
    id,  
    message,
  };
}

export function requestUpdateBorrowingSuccess (result)
{
  return {
    type: REQUEST_UPDATE_BORROWING_SUCCESS,
    result
  };  
}

export function requestGetBorrowing (id,library_id) {
    return {
      type: REQUEST_GET_BORROWING,
      id,
      library_id,
    };  
}

export function requestGetBorrowingSuccess (result) {
  return {
    type: REQUEST_GET_BORROWING_SUCCESS,
    result
  };  
}
 
 export function requestFindUpdateOABorrowingReference(id,borrowing_library_id,reference_id,data,foundMessage,notfoundMessage) {
  console.log("requestFindUpdateOABorrowingReference action")
  return {
    type: REQUEST_FIND_UPDATE_BORROWING_OA,
    id,
    reference_id,
    borrowing_library_id,
    data,
    foundMessage,
    notfoundMessage
  };
}

export function requestFindUpdateOABorrowingReferenceFail(result) {
  return {
    type: REQUEST_FIND_UPDATE_BORROWING_OA_FAIL,
    result
  };
}

export function requestFindUpdateOABorrowingReferenceSuccess(result) {
  return {
    type: REQUEST_FIND_UPDATE_BORROWING_OA_SUCCESS,
    result
  };
}



/* export function requestUpdateLibrarySuccess(result) {
  return {
    type: REQUEST_UPDATE_LIBRARY_SUCCESS,
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
