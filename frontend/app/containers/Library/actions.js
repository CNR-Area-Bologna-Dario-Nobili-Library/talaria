/*
 *
 * Library actions
 *
 */

import { Alert } from "reactstrap";
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
   REQUEST_BORROWINGSTODELIVER_LIST,REQUEST_BORROWINGSTODELIVER_LIST_SUCCESS,
   REQUEST_GET_LIBRARY_TAGS_OPTIONLIST,REQUEST_GET_LIBRARY_TAGS_OPTIONLIST_SUCCESS,
   REQUEST_APPLY_TAGS_TO_DDREQUESTS,REQUEST_REMOVE_DDREQUEST_TAG,REQUEST_REMOVE_LENDINGDDREQUEST_TAG,
   REQUEST_APPLY_LENDING_TAGS_TO_DDREQUESTS,
   REQUEST_POST_LIBRARY_TAG,REQUEST_UPDATE_LIBRARY_TAG,REQUEST_REMOVE_LIBRARY_TAG, 
   REQUEST_POST_NEW_BORROWING,
   REQUEST_GET_BORROWING,REQUEST_GET_BORROWING_SUCCESS,
   REQUEST_GET_LENDING, REQUEST_GET_LENDING_SUCCESS,
   REQUEST_UPDATE_BORROWING,
   REQUEST_UPDATE_BORROWING_SUCCESS,
   REQUEST_FORWARD_BORROWING,
   REQUEST_FORWARD_BORROWING_SUCCESS,
   REQUEST_FIND_UPDATE_BORROWING_OA,
   REQUEST_FIND_UPDATE_BORROWING_OA_FAIL,
   REQUEST_FIND_UPDATE_BORROWING_OA_SUCCESS,
   REQUEST_CHANGE_STATUS_BORROWING,
   REQUEST_CHANGE_STATUS_LENDING,
   REQUEST_CHANGE_STATUS_DELIVERY,
   REQUEST_GET_ISSN_ISBN,
   REQUEST_GET_ISSN_ISBN_SUCCESS,
   REQUEST_GET_ISSN_ISBN_FAIL,
   REQUEST_GET_LIBRARY_DESKS_OPTIONLIST,
   //REQUEST_CHANGE_LENDING_ARCHIVED,
   REQUEST_ACCEPT_ALLLENDER,
   REQUEST_GET_LIBRARY_DESKS_OPTIONLIST_SUCCESS,
   REQUEST_GET_LIBRARY_DESKS,
   REQUEST_GET_LIBRARY_DESKS_SUCCESS,
   REQUEST_GET_LIBRARY_DESK,
   REQUEST_GET_LIBRARY_DESK_SUCCESS,
   REQUEST_GET_COUNTRIES_OPTIONLIST, REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
   REQUEST_LIBRARYSUBJECT_OPTIONLIST, REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_OPTIONLIST,   
   REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST,
   REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST_SUCCESS,
   REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST,
   REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST_SUCCESS,  
   UPLOAD_REQUEST,
   UPLOAD_PROGRESS,
   UPLOAD_FAILURE,
   UPLOAD_SUCCESS,
   REQUEST_GET_LIBRARY_OPERATOR,
   REQUEST_GET_LIBRARY_OPERATOR_SUCCESS,
   REQUEST_GET_LIBRARY_OPERATORS,
   REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS,
   REQUEST_GET_LIBRARY_OPERATORS_SUCCESS, 
   REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
   REQUEST_GET_LIBRARY_PENDING_OPERATORS,
   REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS,
   REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS,
   REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
   REQUEST_REMOVE_LIBRARY_OPERATOR,
   REQUEST_REMOVE_LIBRARY_OPERATOR_SUCCESS,
   REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR,
   REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS
   
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

export function requestGetLibrariesList(options,page='1',pageSize=20,excludeIds=[]) {  
  return {
    type: REQUEST_GET_LIBRARIES_LIST,
    options,    
    excludeIds,
    page,
    pageSize
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


export function requestGetInstitutionsOptionList(request) {
  return {
    type: REQUEST_GET_INSTITUTIONS_OPTIONLIST,
    request
  };
}

export function requestGetInstitutionsOptionListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestGetInstitutionTypesOptionList(request) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST,
    request
  };
}

export function requestGetInstitutionTypesOptionListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST_SUCCESS,
    result
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

export function requestRemoveDDLendingRequestTag(library_id,id,tagId,message, filter) {
  return {
    type: REQUEST_REMOVE_LENDINGDDREQUEST_TAG,
    id,
    tagId,
    message,
    filter,
    library_id
  };
}


export function requestApplyTagsToDDRequests(library_id,reqIds,tagIds,message,  filter) {
  return {
    type: REQUEST_APPLY_TAGS_TO_DDREQUESTS,
    reqIds,
    tagIds,
    message,
    filter,
    library_id,
  };
}

export function requestApplyLendingTagsToDDRequests(library_id,reqIds,tagIds,message) {
  return {
    type: REQUEST_APPLY_LENDING_TAGS_TO_DDREQUESTS,
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

export function requestBorrowingToDeliverList(library_id,page, pageSize, filter) {
  return {
    type: REQUEST_BORROWINGSTODELIVER_LIST,
    library_id,    
    page,
    filter,
    pageSize
  };
}                

export function requestBorrowingToDeliverListSuccess(result) {
  return {
    type: REQUEST_BORROWINGSTODELIVER_LIST_SUCCESS,
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


export function requestUpdateBorrowing(id,library_id,reqData,message,filter){
  return {
    type: REQUEST_UPDATE_BORROWING,
    borrowing_library_id:library_id,
    borrowing: reqData,  
    id,  
    message,
    filter
  };
}

export function requestUpdateBorrowingSuccess (result)
{
  return {
    type: REQUEST_UPDATE_BORROWING_SUCCESS,
    result
  };  
}

export function requestForwardBorrowing(id,library_id,reqData,message,filter){
  return {
    type: REQUEST_FORWARD_BORROWING,
    borrowing_library_id:library_id,
    borrowing: reqData,  
    id,  
    message,
    filter
  };
}

export function requestForwardBorrowingSuccess (result)
{
  return {
    type: REQUEST_FORWARD_BORROWING_SUCCESS,
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


export function requestGetLending (id,library_id) {
  return {
    type: REQUEST_GET_LENDING,
    id,
    library_id,
  };  
}


export function requestGetLendingSuccess (result) {
  return {
    type: REQUEST_GET_LENDING_SUCCESS,
    result
  };  
}

export function requestGetBorrowingSuccess (result) {
  return {
    type: REQUEST_GET_BORROWING_SUCCESS,
    result
  };  
}
 
 export function requestFindUpdateOABorrowingReference(id,borrowing_library_id,reference_id,data,foundMessage,notfoundMessage,filter) {
  console.log("requestFindUpdateOABorrowingReference action")
  return {
    type: REQUEST_FIND_UPDATE_BORROWING_OA,
    id,
    reference_id,
    borrowing_library_id,
    data,
    filter,
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

export function requestChangeStatusBorrowing(id,borrowing_library_id,status, extrafields,message,filter) {
  return {
    type: REQUEST_CHANGE_STATUS_BORROWING,
    id,
    borrowing_library_id,    
    status,
    extrafields,
    message,
    filter
  };
}

export function requestChangeStatusLending(id,lending_library_id,status, extrafields, message,filter) {

  return {
    type: REQUEST_CHANGE_STATUS_LENDING,
    id,
    lending_library_id,
    status,
    extrafields,
    message,
    filter
  };
}

export function requestChangeStatusDelivery(id,borrowing_library_id,status, extrafields,message,filter) {
  return {
    type: REQUEST_CHANGE_STATUS_DELIVERY,
    id,
    borrowing_library_id,    
    status,
    extrafields,
    message,
    filter
  };
}

export function requestGetLibraryDesksOptionList(library_id) {
  return {
    type: REQUEST_GET_LIBRARY_DESKS_OPTIONLIST,
    library_id,
  };
}

export function requestGetLibraryDesksOptionListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_DESKS_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestPickupList(library_id,page, pageSize, query) {
  return {
    type: REQUEST_GET_LIBRARY_DESKS,
    library_id,
    page,
    pageSize,
    query
  };
}

export function requestPickupListSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_DESKS_SUCCESS,
    result
  };
}

export function requestPickup(library_id,desk_id) {
  return {
    type: REQUEST_GET_LIBRARY_DESK,
    library_id,
    desk_id,
  };
}

export function requestPickupSuccess(result) {
  return {
    type: REQUEST_GET_LIBRARY_DESK_SUCCESS,
    result
  };
}


/*not used
export function requestChangeLendingArchived(id,lending_library_id,status, message,filter) {
  return {
    type: REQUEST_CHANGE_LENDING_ARCHIVED,
    id,
    lending_library_id,
    status,
    message,
    filter
  };
}*/


export function requestAcceptAllLenderLending(id,lending_library_id,status, message,filter) {
  return {
    type: REQUEST_ACCEPT_ALLLENDER,
    id,
    lending_library_id,
    status,
    message,
    filter
  };
}



export function requestuploadFile(id,lending_library_id,selectedFile, originalfilename, status, message,filter) {
  return {
     type: UPLOAD_REQUEST,
     id,
     lending_library_id,
     selectedFile,
     payload: originalfilename,
     status,
     message,
     filter
   };
 }
 
 export function uploadProgress(id,lending_library_id,file, progress, status, message,filter) {
   return {
     type: UPLOAD_PROGRESS,
     id,
     lending_library_id,
     file,
     progress,
     status,
     message,
     filter
   };
 }
 
 export function uploadSuccess(result) {
  return {
     type: UPLOAD_SUCCESS,
     result
   };

   

    
 }
 
 export function uploadFailure(id,lending_library_id,file, status, message,filter) {
   return {
     type: UPLOAD_FAILURE,
     id,
     lending_library_id,
     file,
     status,
     message,
     filter
   };
 }

export function requestFindISSNISBN (data) {
  return {
    type: REQUEST_GET_ISSN_ISBN,
    data    
  };
}

export function requestFindISSNISBNSuccess(result) {
  return {
    type: REQUEST_GET_ISSN_ISBN_SUCCESS,
    result
  };
}

export function requestFindISSNISBNFail (result) {
  return {
    type: REQUEST_GET_ISSN_ISBN_FAIL,
    result
  };
}

export function requestGetCountriesOptionList(request) {
  return {
      type: REQUEST_GET_COUNTRIES_OPTIONLIST,
      request
    };
  }
  
  export function requestGetCountriesOptionListSuccess(result) {
    return {
      type: REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
      result
    };
  }

  export function requestLibrarySubjectOptionList(request) {
    return {
      type: REQUEST_LIBRARYSUBJECT_OPTIONLIST,
      request
    };
  }
  
  export function requestLibrarySubjectOptionListSuccess(result) {
    return {
      type: REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS,
      result
    };
  }

  export function requestLibraryIdentifierTypesOptionList(request) {
    return {
      type: REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST,
      request
    };
  }
  
  export function requestLibraryIdentifierTypesOptionListSuccess(result) {
    return {
      type: REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST_SUCCESS,
      result
    };
  }

  export function requestGetLibraryOperators(library_id) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATORS,      
      library_id
    };
  }

  export function requestGetLibraryOperator(library_id,userid) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATOR,      
      library_id,
      userid
    };
  }

  export function requestGetLibraryOperatorSuccess(result) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATOR_SUCCESS,      
      result
    };
  }

  export function requestGetLibraryOperatorPermissions(library_id,userid) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS,      
      library_id,
      userid
    };
  }
  
  export function requestGetLibraryPendingOperators(library_id) {
    return {
      type: REQUEST_GET_LIBRARY_PENDING_OPERATORS,   
      library_id   
    };
  }

  export function requestGetLibraryOperatorsSuccess(result) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATORS_SUCCESS,
      result
    };
  }

  export function requestGetLibraryOperatorPermissionsSuccess(result) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
      result
    };
  }
  
  export function requestGetLibraryPendingOperatorsSuccess(result) {
    return {
      type: REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS,
      result
    };
  }
  
  export function requestUpdateLibraryOperatorPermissions(library_id,userid,permissions,message) {
    return {
      type: REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS,
      library_id,
      userid,
      permissions,
      message
    };
  }                    
  
  /*export function requestUpdateLibraryOperatorPermissionsSuccess(result) {
    return {
      type: REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
      result
    };
  }*/

  export function requestRemoveLibraryOperator(library_id,userid,message) {
    return {
      type: REQUEST_REMOVE_LIBRARY_OPERATOR,
      library_id,
      userid,      
      message
    };
  }

  export function requestRemoveLibraryOperatorSuccess(result) {
    return {
      type: REQUEST_REMOVE_LIBRARY_OPERATOR_SUCCESS,
      result
    };
  }

  export function requestRemoveLibraryPendingOperator(library_id,pendingid,message) {
    return {
      type: REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR,
      library_id,
      pendingid,      
      message
    };
  }

  export function requestRemoveLibraryPendingOperatorSuccess(result) {
    return {
      type: REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS,
      result
    };
  }
  
  

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
