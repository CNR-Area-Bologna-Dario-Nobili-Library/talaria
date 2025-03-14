/*
 *
 * Admin reducer
 *
 */
import produce from 'immer';
import { lowerCase } from 'lodash';
import {DEFAULT_ACTION, REQUEST_SUCCESS,
  REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
  REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS,
  REQUEST_USERS_OPTIONLIST, REQUEST_USERS_OPTIONLIST_SUCCESS,
  REQUEST_USER, REQUEST_USER_SUCCESS,
  REQUEST_GET_LIBRARY, REQUEST_GET_LIBRARY_SUCCESS,
  REQUEST_DELETE_LIBRARY,
  REQUEST_GET_LIBRARIES_LIST, REQUEST_GET_LIBRARIES_LIST_SUCCESS,
  REQUEST_UPDATE_LIBRARY, REQUEST_POST_LIBRARY,
  REQUEST_POST_USER,
  REQUEST_GET_ROLES, REQUEST_GET_ROLES_SUCCESS,
  REQUEST_GET_PROJECT, REQUEST_GET_PROJECT_SUCCESS,
  REQUEST_GET_PROJECTS_LIST, REQUEST_GET_PROJECTS_LIST_SUCCESS,
  REQUEST_UPDATE_PROJECT, REQUEST_POST_PROJECT,
  REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS,
  REQUEST_GET_INSTITUTION_TYPE_LIST,
  REQUEST_GET_INSTITUTIONS_LIST,
  REQUEST_GET_INSTITUTIONS_LIST_SUCCESS,

  REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST,
  REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST_SUCCESS,
  

  REQUEST_GET_INSTITUTION, REQUEST_GET_INSTITUTION_SUCCESS,
  REQUEST_GET_INSTITUTIONS_OPTIONLIST, REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
  
  REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST,REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS,

  REQUEST_INSTITUTION_TYPE_OPTIONLIST, REQUEST_INSTITUTION_TYPE_OPTIONLIST_SUCCESS,
  REQUEST_GET_COUNTRIES_OPTIONLIST, REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
  REQUEST_LIBRARYSUBJECT_OPTIONLIST, REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS,
  UPDATE_INSTITUTION,
  UPDATE_INSTITUTION_TYPE,
  REQUEST_GET_INSTITUTION_TYPE,  
  REQUEST_GET_INSTITUTION_TYPE_SUCCESS,  
  REQUEST_GET_LIBRARY_LIST,
  REQUEST_GET_LIBRARY_LIST_SUCCESS,
  REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST,
  REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATORS,
  REQUEST_GET_LIBRARY_OPERATORS_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATOR,
  REQUEST_GET_LIBRARY_OPERATOR_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS,
  REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
  REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS,
  REQUEST_REMOVE_LIBRARY_OPERATOR,
  REQUEST_REMOVE_LIBRARY_OPERATOR_SUCCESS,
  REQUEST_GET_LIBRARY_PENDING_OPERATORS,
  REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS,
  REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR,
  REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS
} from "./constants";

export const initialState = {
  loading: false,
  usersList: {
    pagination: {},
    data: [],
  },
  usersOptionList: [],
  user: [],
  error: null,
  libraryOptionList: {
    pagination: {},
    data: [],
  },
  library: [],
  operator:{},
  operators:{},
  operatorPerm:[],
  pending_operators:{},
  pending_operator:{},
  institutionTypes: {
    pagination: {},
    data: [],
  },
  project: [],
  projectsList: {
    pagination: {},
    data: [],
  },
  institutionsList: {
    pagination: {},
    data: [],
  },
  // identifiersList: {
  //   pagination: {},
  //   data: [],
  // },
  institution: [],
  institutiontype:[],
  institutionsOptionList: [],
  institutionTypesOptionList: [],
  institutionsByTypeCountryOptionList: [],
  identifiersOptionList:  [],

  countriesOptionList: [],
  libraryProjectsOptionList: [],
  librarySubjectOptionList: [],
  roles: [],
  resources: [],
  places: {},
};

/* eslint-disable default-case, no-param-reassign */
const AdminReducer = (state = initialState, action) =>
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
        draft.usersList.data = action.result.data
        draft.usersList.pagination = action.result.meta.pagination
        break;
      case REQUEST_UPDATE_USER:
        draft.loading = true;
        draft.error = action.error;
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
        draft.error = initialState.error;
        draft.user = {
          ...action.result.data,
          roles: action.result.data.roles.data,
          resources: action.result.data.resources.data,
        }
        break;
      case REQUEST_USERS_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_USERS_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.usersOptionList = action.result.map(item => { return {value: item.id, label: item.full_name} } );
        break;
      case REQUEST_GET_ROLES:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_ROLES_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.roles = action.result.data.roles;
        draft.resources = action.result.data.resources;
        break;
      case REQUEST_POST_LIBRARY:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARY:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_DELETE_LIBRARY:
          draft.loading = true;
          draft.error = action.error;
          break;
      case REQUEST_GET_LIBRARY_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.library = action.result.data
        //draft.library.granted_permissions = action.result.data.granted_permissions ? action.result.data.granted_permissions.data : []
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
        draft.libraryOptionList.data = action.result.data
        draft.libraryOptionList.pagination = action.result.meta.pagination
        break;
      case REQUEST_GET_INSTITUTION:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTION_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.institution = action.result.data
        //draft.institution.granted_permissions = action.result.data.granted_permissions.data
        break;
      case UPDATE_INSTITUTION:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTIONS_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.institutionsOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );        
        break;

      case REQUEST_GET_INSTITUTION_TYPE:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTION_TYPE_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.institutiontype = action.result.data
        //draft.institution.granted_permissions = action.result.data.granted_permissions.data
        break;
      case UPDATE_INSTITUTION_TYPE:
        draft.loading = true;
        draft.error = action.error;
        break;
      
      case REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.institutionsByTypeCountryOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );        
        //draft.institutionsByTypeCountryOptionList.push({"value":0,"label":"Institution not present"})
        break;
      case REQUEST_GET_INSTITUTIONS_LIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTIONS_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.institutionsList.data = action.result.data
        draft.institutionsList.pagination = action.result.meta.pagination
        break;
        // case REQUEST_GET_LIBRARY_IDENTIFIERS_OPTIONLIST:
      //   draft.loading = true;
      //   draft.error = action.error;
      //   break;
      // case REQUEST_GET_LIBRARY_IDENTIFIERS_OPTIONLIST_SUCCESS:
      //   draft.loading = false;
      //   draft.error = initialState.error;
      //   draft.identifiersList.data = action.result.data
      //   draft.identifiersList.pagination = action.result.meta.pagination

      //   break;


      case REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARY_IDENTIFIER_TYPES_OPTIONLIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.identifiersOptionList = action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );

      break;

      case REQUEST_INSTITUTION_TYPE_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_INSTITUTION_TYPE_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.institutionTypesOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );
        break;
      case REQUEST_GET_COUNTRIES_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.countriesOptionList =  action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );
        break;
      case REQUEST_LIBRARYSUBJECT_OPTIONLIST:
        draft.error = action.error;
        break;
      case REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS:
        draft.error = initialState.error;
        draft.librarySubjectOptionList =  action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );
        break;
      case REQUEST_GET_INSTITUTION_TYPE_LIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_INSTITUTION_TYPE_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.institutionTypes.data = action.result.data;
        draft.institutionTypes.pagination = action.result.meta.pagination;
        break;
      case REQUEST_POST_PROJECT:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_PROJECT:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_PROJECT_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.project = action.result.data
        draft.project.granted_permissions = action.result.data.granted_permissions.data
        break;
      case REQUEST_UPDATE_PROJECT:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_PROJECTS_LIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_PROJECTS_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.projectsList.data = action.result.data
        draft.projectsList.pagination = action.result.meta.pagination
        break;
      case REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST:
        draft.loading = true;
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.libraryProjectsOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );
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

          
          case REQUEST_GET_LIBRARY_LIST:
            draft.loading = true;
            draft.error = action.error;
            break;  
          case REQUEST_GET_LIBRARY_LIST_SUCCESS:
            draft.loading = false;
            draft.error = initialState.error;
            draft.libraryOptionList = action.result;
            draft.libraryOptionList.pagination = action.result.meta.pagination
            break;  

            case REQUEST_GET_LIBRARY_OPERATORS:
              draft.loading = true;
              draft.error = initialState.error;             
              break;

              case REQUEST_GET_LIBRARY_OPERATORS_SUCCESS:
                draft.loading = false;          
                draft.error = initialState.error; 
                draft.operators = action.result;
                break;
                
                
                case REQUEST_GET_LIBRARY_OPERATOR:
                draft.loading = false;
                draft.error = initialState.error;             
                break;  

                case REQUEST_GET_LIBRARY_OPERATOR_SUCCESS:
            draft.loading = false;         
            draft.error = initialState.error; 
            draft.operator = action.result.data;            
            break;  
    

            case REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS:
              draft.loading = false;
              draft.error = initialState.error;             
              break;  
                    

        

          case REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS:
            draft.loading = false;         
            draft.error = initialState.error; 
            draft.operatorPerm = action.result;            
            break;  

          case REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS:
            draft.error = initialState.error;               
            break;  
                                    
            case REQUEST_REMOVE_LIBRARY_OPERATOR:
              draft.error = initialState.error;               
              break;   
                        
            case REQUEST_REMOVE_LIBRARY_OPERATOR_SUCCESS:
              draft.loading = false;          
              draft.error = initialState.error; 
              draft.operators = action.result;
              break;  

              case REQUEST_GET_LIBRARY_PENDING_OPERATORS:
          draft.error = initialState.error;               
          break;        
        
        case REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS:
            draft.error = initialState.error; 
            draft.pending_operators = action.result.data;
            break;  
            
        
        
        case REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR:
          draft.error = initialState.error;               
          break;   
                    
        case REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS:
          draft.loading = false;          
          draft.error = initialState.error; 
          draft.pending_operators = action.result.data;
          break;    





    }
  });

export default AdminReducer;
