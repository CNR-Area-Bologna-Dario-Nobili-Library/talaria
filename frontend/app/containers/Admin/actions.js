/*
 *
 * Admin actions
 *
 */

import {DEFAULT_ACTION, REQUEST_SUCCESS,
   REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
   REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS,
   REQUEST_USER, REQUEST_USER_SUCCESS,
   REQUEST_STATUS_CHANGE_LIBRARY,
   REQUEST_USERS_OPTIONLIST, REQUEST_USERS_OPTIONLIST_SUCCESS,
   REQUEST_GET_LIBRARY, REQUEST_GET_LIBRARY_SUCCESS,
   REQUEST_GET_LIBRARIES_LIST, REQUEST_GET_LIBRARIES_LIST_SUCCESS,
   REQUEST_UPDATE_LIBRARY, /* REQUEST_UPDATE_LIBRARY_SUCCESS, */
   REQUEST_DELETE_LIBRARY,
   REQUEST_POST_LIBRARY, REQUEST_POST_LIBRARY_SUCCESS,
   REQUEST_POST_USER, REQUEST_POST_USER_SUCCESS,
   REQUEST_POST_PUBLIC_LIBRARY, REQUEST_POST_PUBLIC_LIBRARY_SUCCESS,
   REQUEST_GET_ROLES, REQUEST_GET_ROLES_SUCCESS,
   REQUEST_GET_PROJECT, REQUEST_GET_PROJECT_SUCCESS,
   REQUEST_GET_PROJECTS_LIST, REQUEST_GET_PROJECTS_LIST_SUCCESS,   
   REQUEST_UPDATE_PROJECT, 
   REQUEST_POST_PROJECT,
   REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST, REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS,
   REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST, REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_LIST, REQUEST_GET_INSTITUTIONS_LIST_SUCCESS,
  //REQUEST_GET_IDENTIFIERS_LIST, REQUEST_GET_IDENTIFIERS_LIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_OPTIONLIST, REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST, REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTION, REQUEST_GET_INSTITUTION_SUCCESS,
   REQUEST_INSTITUTION_TYPE_OPTIONLIST, REQUEST_INSTITUTION_TYPE_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS, REQUEST_GET_INSTITUTION_TYPE_LIST,
   REQUEST_POST_INSTITUTION, UPDATE_INSTITUTION,
   REQUEST_LIBRARYSUBJECT_OPTIONLIST, REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS,
   REQUEST_GET_COUNTRIES_OPTIONLIST, REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
   REQUEST_GET_LIBRARY_LIST,
   REQUEST_GET_LIBRARY_LIST_SUCCESS,
   REQUEST_STATUS_CHANGE_INSTITUTION,
   REQUEST_DELETE_INSTITUTION,
   REQUEST_POST_INSTITUTION_TYPE,
   REQUEST_GET_INSTITUTION_TYPE,
   REQUEST_GET_INSTITUTION_TYPE_SUCCESS,
   UPDATE_INSTITUTION_TYPE,
   REQUEST_DELETE_INSTITUTION_TYPE,
   REQUEST_GET_LIBRARY_OPERATOR,
   REQUEST_GET_LIBRARY_OPERATOR_SUCCESS,
   REQUEST_GET_LIBRARY_OPERATORS,
   REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS,
   REQUEST_GET_LIBRARY_PENDING_OPERATORS,
   REQUEST_GET_LIBRARY_OPERATORS_SUCCESS,
   REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
   REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS,
   REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS,
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

export function requestUsersList(page, query) {
  return {
    type: REQUEST_USERS_LIST,
    page,
    query
  };
}

export function requestUsersListSuccess(result) {
  return {
    type: REQUEST_USERS_LIST_SUCCESS,
    result
  };
}


export function requestUser(id) {
  return {
    type: REQUEST_USER,
    id
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

export function requestUpdateUser(request, message) {
  return {
    type: REQUEST_UPDATE_USER,
    request,
    message
  };
}

/* export function requestUpdateUserSuccess(result) {
  return {
    type: REQUEST_UPDATE_USER_SUCCESS,
    result
  };
} */

export function requestGetRoles() {
  return {
    type: REQUEST_GET_ROLES,
  };
}

export function requestGetRolesSuccess(result) {
  return {
    type: REQUEST_GET_ROLES_SUCCESS,
    result
  };
}

export function requestUsersOptionList(request) {
  return {
    type: REQUEST_USERS_OPTIONLIST,
    request
  };
}

export function requestUsersOptionListSuccess(result) {
  return {
    type: REQUEST_USERS_OPTIONLIST_SUCCESS,
    result
  };
}

export function requestGetLibrariesList(options,page = '1', pageSize=20) {
  return {
    type: REQUEST_GET_LIBRARIES_LIST,
    options,        
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

export function requestPostPublicLibrary(request, message) {
  return {
    type: REQUEST_POST_PUBLIC_LIBRARY,
    request,
    message
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

//search for a place in the map for the library registration

export function requestGetLibrary(id) {
  return {
    type: REQUEST_GET_LIBRARY,
    id
  };
}

export function requestDeleteLibrary(id,message) {
  return {
    type: REQUEST_DELETE_LIBRARY,
    id,
    message
  };
}

export function requestStatusChangeLibrary(library_id,status,message) {
  return {
    type: REQUEST_STATUS_CHANGE_LIBRARY,
    library_id,
    status,
    message
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

export function requestGetProjectsList(page='1') {
  return {
    type: REQUEST_GET_PROJECTS_LIST,
    page
  };
}

export function requestGetProjectsListSuccess(result) {
  return {
    type: REQUEST_GET_PROJECTS_LIST_SUCCESS,
    result
  };
}

export function requestPostProject(request, message) {
  return {
    type: REQUEST_POST_PROJECT,
    request,
    message
  };
}

export function requestGetProject(id) {
  return {
    type: REQUEST_GET_PROJECT,
    id
  };
}

export function requestGetProjectSuccess(result) {
  return {
    type: REQUEST_GET_PROJECT_SUCCESS,
    result
  };
}

export function requestUpdateProject(request, message) {
  return {
    type: REQUEST_UPDATE_PROJECT,
    request,
    message
  };
}


export function requestGetlibraryProjectsOptionList(request)
{
return {
  type: REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST,
  request
};
}



export function requestGetlibraryProjectsOptionListSuccess(result)
{
return {
  type: REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS,
  result
};
}

export function requestGetlibraryIdentifiersOptionList(request)
{
return {
  type: REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST,
  request
};
}

export function requestGetlibraryIdentifiersOptionListSuccess(result)
{
return {
  type: REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST_SUCCESS,
  result
};
}



/* export function requestUpdateLibrarySuccess(result) {
  return {
    type: REQUEST_UPDATE_LIBRARY_SUCCESS,
    result
  };
} */

export function requestGetInstitutionsList(page = '1',  pageSize=20,   options   ) {
  return {
    type: REQUEST_GET_INSTITUTIONS_LIST,
    page,
    pageSize,
    options    
  };
}

export function requestGetInstitutionsListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTIONS_LIST_SUCCESS,
    result
  };
}

export function requestUpdateInstitution(request, message) {
  return {
    type: UPDATE_INSTITUTION,
    request,
    message
  };
}

export function requestDeleteInstitution(id,message) {
  return {
    type: REQUEST_DELETE_INSTITUTION,
    id,
    message
  };
}

export function requestUpdateInstitutionType(request, message) {
  return {
    type: UPDATE_INSTITUTION_TYPE,
    request,
    message
  };
}

export function requestDeleteInstitutionType(id,message) {
  return {
    type: REQUEST_DELETE_INSTITUTION_TYPE,
    id,
    message
  };
}




export function requestGetInstitution(id) {
  return {
    type: REQUEST_GET_INSTITUTION,
    id
  };
}

export function requestGetInstitutionType(id) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPE,
    id
  };
}

export function requestGetInstitutionTypeSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPE_SUCCESS,
    result
  };
}


export function requestPostInstitution(request, message) {
  return {
    type: REQUEST_POST_INSTITUTION,
    request,
    message
  };
}

export function requestPostInstitutionType(request, message) {
  return {
    type: REQUEST_POST_INSTITUTION_TYPE,
    request,
    message
  };
}


export function requestGetInstitutionSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTION_SUCCESS,
    result
  };
}

export function requestStatusChangeInstitution(institution_id,status,message) {
  return {
    type: REQUEST_STATUS_CHANGE_INSTITUTION,
    institution_id,
    status,
    message
  };
}


export function requestGetInstitutionsByTypeByCountryOptionList(request, countryid, institutiontypeid) {
  return {
    type: REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST,
    request,
    countryid,
    institutiontypeid
  };
}

export function requestGetInstitutionsByTypeByCountryOptionListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS,
    result
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

export function requestGetInstitutionTypeOptionList(request) {
  return {
    type: REQUEST_INSTITUTION_TYPE_OPTIONLIST,
    request
  };
}

export function requestGetInstitutionTypesOptionListSuccess(result) {
  return {
    type: REQUEST_INSTITUTION_TYPE_OPTIONLIST_SUCCESS,
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


export function requestGetInstitutionTypesList(page = '1', pageSize, searchFilter) {  
  return {
    type: REQUEST_GET_INSTITUTION_TYPE_LIST,
    page,
    pageSize,
    searchFilter
  };
}

export function requestGetInstitutionTypesListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS,
    result
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


 export function requestGetLibraryOperators(library_id) {
    return {
      type: REQUEST_GET_LIBRARY_OPERATORS,      
      library_id
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