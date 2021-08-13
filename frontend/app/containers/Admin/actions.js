/*
 *
 * Admin actions
 *
 */

import {DEFAULT_ACTION, REQUEST_SUCCESS,
   REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
   REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS,
   REQUEST_USER, REQUEST_USER_SUCCESS,
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
   REQUEST_GET_PROJECTS_OPTIONLIST, REQUEST_GET_PROJECTS_OPTIONLIST_SUCCESS,
   REQUEST_UPDATE_PROJECT, 
   REQUEST_POST_PROJECT,
   REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST, REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_LIST, REQUEST_GET_INSTITUTIONS_LIST_SUCCESS,
   REQUEST_GET_INSTITUTIONS_OPTIONLIST, REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
  REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST, REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS,
   REQUEST_GET_INSTITUTION, REQUEST_GET_INSTITUTION_SUCCESS,
   REQUEST_INSTITUTIONSTYPES_OPTIONLIST, REQUEST_INSTITUTIONSTYPES_OPTIONLIST_SUCCESS,
      REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS, REQUEST_GET_INSTITUTION_TYPE_LIST,
   REQUEST_POST_INSTITUTION, UPDATE_INSTITUTION,
   REQUEST_GET_COUNTRIES_OPTIONLIST, REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
   REQUEST_LIBRARYSUBJECT_OPTIONLIST, REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS,
   REQUEST_SEARCH_PLACES_BY_TEXT,
   REQUEST_SEARCH_PLACES_BY_TEXT_SUCCESS,
   REQUEST_SEARCH_PLACES_BY_TEXT_FAIL,
   REQUEST_GET_LIBRARY_LIST,
   REQUEST_GET_LIBRARY_LIST_SUCCESS
 
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

export function requestGetLibrariesList(page = '1', query) {
  return {
    type: REQUEST_GET_LIBRARIES_LIST,
    page,
    query
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

//search for a place in the map for the library registration
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

export function deleteLibrary(id,message) {
  return {
    type: REQUEST_DELETE_LIBRARY,
    id,
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

export function requestGetProjectsOptionList(request) {
  return {
    type: REQUEST_GET_PROJECTS_OPTIONLIST,
    request
  };
}

export function requestGetProjectsOptionListSuccess(result) {
  return {
    type: REQUEST_GET_PROJECTS_OPTIONLIST_SUCCESS,
    result
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

/* export function requestUpdateLibrarySuccess(result) {
  return {
    type: REQUEST_UPDATE_LIBRARY_SUCCESS,
    result
  };
} */

export function requestGetInstitutionsList(page, query) {
  return {
    type: REQUEST_GET_INSTITUTIONS_LIST,
    page,
    query
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

export function requestGetInstitution(id) {
  return {
    type: REQUEST_GET_INSTITUTION,
    id
  };
}

export function requestPostInstitution(request, message) {
  return {
    type: REQUEST_POST_INSTITUTION,
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
    type: REQUEST_INSTITUTIONSTYPES_OPTIONLIST,
    request
  };
}

export function requestGetInstitutionTypeOptionListSuccess(result) {
  return {
    type: REQUEST_INSTITUTIONSTYPES_OPTIONLIST_SUCCESS,
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

export function requestGetInstitutionTypeList(page) {
  console.log('requestGetInstitutionTypeList PASSO DA QUI?')
  return {
    type: REQUEST_GET_INSTITUTION_TYPE_LIST,
    page
  };
}
export function requestGetInstitutionTypeListSuccess(result) {
  return {
    type: REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS,
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