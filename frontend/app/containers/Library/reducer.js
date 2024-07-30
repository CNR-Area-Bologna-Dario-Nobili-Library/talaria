/*
 *
 * Library reducer
 *
 */
import produce from 'immer';
import { bindActionCreators } from 'redux';
import {DEFAULT_ACTION, REQUEST_SUCCESS,
  REQUEST_ERROR, STOP_LOADING, REQUEST_USERS_LIST, REQUEST_USERS_LIST_SUCCESS,
  REQUEST_UPDATE_USER, REQUEST_UPDATE_USER_SUCCESS,
  REQUEST_USER, REQUEST_USER_SUCCESS,
  REQUEST_GET_LIBRARY, REQUEST_GET_LIBRARY_SUCCESS,
  REQUEST_GET_LIBRARIES_LIST, REQUEST_GET_LIBRARIES_LIST_SUCCESS,
  REQUEST_UPDATE_LIBRARY, REQUEST_POST_LIBRARY,
  REQUEST_POST_USER,
  REQUEST_BORROWINGS_LIST,REQUEST_BORROWINGS_LIST_SUCCESS,REQUEST_LENDINGS_LIST,REQUEST_LENDINGS_LIST_SUCCESS,
  REQUEST_BORROWINGSTODELIVER_LIST,REQUEST_BORROWINGSTODELIVER_LIST_SUCCESS,
  REQUEST_GET_LIBRARY_TAGS_OPTIONLIST,REQUEST_GET_LIBRARY_TAGS_OPTIONLIST_SUCCESS, REQUEST_POST_NEW_BORROWING,
  REQUEST_GET_BORROWING,REQUEST_GET_BORROWING_SUCCESS, REQUEST_UPDATE_BORROWING, REQUEST_UPDATE_BORROWING_SUCCESS,
  REQUEST_FORWARD_BORROWING, REQUEST_FORWARD_BORROWING_SUCCESS,
  REQUEST_GET_LENDING,REQUEST_GET_LENDING_SUCCESS,
  REQUEST_FIND_UPDATE_BORROWING_OA,REQUEST_FIND_UPDATE_BORROWING_OA_FAIL,REQUEST_FIND_UPDATE_BORROWING_OA_SUCCESS,  
  REQUEST_ACCEPT_ALLLENDER,
  REQUEST_GET_ISSN_ISBN,
  REQUEST_GET_ISSN_ISBN_SUCCESS,
  REQUEST_GET_ISSN_ISBN_FAIL,  
  REQUEST_GET_LIBRARY_DESKS_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_DESKS_OPTIONLIST,
  REQUEST_GET_LIBRARY_DESKS,
  REQUEST_GET_LIBRARY_DESKS_SUCCESS,
  REQUEST_GET_LIBRARY_DESK,
  REQUEST_GET_LIBRARY_DESK_SUCCESS,
  REQUEST_GET_COUNTRIES_OPTIONLIST, REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS,
  REQUEST_LIBRARYSUBJECT_OPTIONLIST, REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS, 
  REQUEST_GET_INSTITUTIONS_OPTIONLIST,REQUEST_GET_INSTITUTIONS_OPTIONLIST_SUCCESS,
  REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST,REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST_SUCCESS,
  REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST,REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATORS,
  REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS,
  REQUEST_GET_LIBRARY_PENDING_OPERATORS,
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  UPLOAD_PROGRESS,
  REQUEST_GET_LIBRARY_OPERATOR,
  REQUEST_GET_LIBRARY_OPERATOR_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATORS_SUCCESS,
  REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
  REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS,
  REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS,
  REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS,
  REQUEST_REMOVE_LIBRARY_OPERATOR,
  REQUEST_REMOVE_LIBRARY_OPERATOR_SUCCESS,
  REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS,
  REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR,
  REQUEST_GET_USERS_OPTION_ITEMS,
  REQUEST_GET_USERS_OPTION_ITEMS_SUCCESS,
  REQUEST_INVITE_LIBRARY_OPERATOR,
  REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST,REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS,
  REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST,REQUEST_GET_LIBRARY_PROJECTS_OPTIONLIST_SUCCESS
} from "./constants";

export const initialState = {
  loading: false,
  library: {},
  pickupsList:{
    data: [],
    pagination: {}
  },
  pickup : {},
  departmentOptionList: [],
  usersList: {
    data: [],
    pagination: {}
  },
  borrowingsList: {
    data: [],
    pagination: {},
    oaloading: [],
  },
  borrowing: {},
  lending: {},
  tagsOptionList:[],
  desksOptionList:[],
  lendingsList: {
    data: [],
    pagination: {}
  },
  fileupload: "",
  findISSNISBNresults: {
    loading:false,
    data: [],    
  },
  libraryOptionList: {
    loading: false,
    data:[],
    pagination: {}
  },
  librarySubjectOptionList: [],
  countriesOptionList: [],
  institutionsOptionList: [],
  institutionTypesOptionList: [],
  institutionsByTypeCountryOptionList: [],
  libraryIdentifierTypesOptionList:[],
  libraryProjectsOptionList:[],
  error: null,
  user: {},
  operator:{},
  operators:{},
  operatorPerm:[],
  pending_operators:{},
  pending_operator:{},
  searchUsersOptionList: [],
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
        draft.library.granted_permissions = action.result.data.granted_permissions ? action.result.data.granted_permissions.data : []
        draft.departmentOptionList = action.result.data.departments? action.result.data.departments.data.map(dep => {
            return {value: dep.id, label: dep.name}
        }):[]        
        break;
      case REQUEST_UPDATE_LIBRARY:
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

          case REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST:
            draft.error = action.error;
            break;
          case REQUEST_GET_INSTITUTION_TYPES_OPTIONLIST_SUCCESS:
            draft.error = initialState.error;
            draft.institutionTypesOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );        
            break;  

          case REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST:
            draft.error = action.error;
            break;
          case REQUEST_GET_INSTITUTIONS_TYPE_COUNTRY_OPTIONLIST_SUCCESS:
            draft.error = initialState.error;
            draft.institutionsByTypeCountryOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );        
            //draft.institutionsByTypeCountryOptionList.push({"value":0,"label":"Institution not present"})
            break;  



       case REQUEST_GET_LIBRARIES_LIST:
        draft.libraryOptionList.loading=true
        draft.error = action.error;
        break;
      case REQUEST_GET_LIBRARIES_LIST_SUCCESS:
        draft.libraryOptionList.loading = false;
        draft.error = initialState.error;
        draft.libraryOptionList = action.result
        draft.libraryOptionList.pagination = action.result.meta.pagination
        break;

        case REQUEST_GET_LIBRARY_TAGS_OPTIONLIST:
          draft.loading = true;
          draft.error = action.error;
          break;
        case REQUEST_GET_LIBRARY_TAGS_OPTIONLIST_SUCCESS:
            draft.loading = false;
            draft.error = initialState.error;
            draft.tagsOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );
            break;  

       case REQUEST_GET_LIBRARY_DESKS_OPTIONLIST: 
       draft.loading = true;
       draft.error = action.error;
       break;     

       case REQUEST_GET_LIBRARY_DESKS_OPTIONLIST_SUCCESS: 
       draft.loading = false;
       draft.error = initialState.error;
       draft.desksOptionList = action.result.map(item => { return {value: item.id, label: item.name} } );
       break;     

       case REQUEST_GET_LIBRARY_DESKS:
          draft.loading = true;
          break;
        case REQUEST_GET_LIBRARY_DESKS_SUCCESS:
          draft.loading = false;
          draft.error = initialState.error;
          draft.pickupsList.data = action.result.data;
          draft.pickupsList.pagination = action.result.meta.pagination
          break; 
       
        case REQUEST_GET_LIBRARY_DESK:
            draft.loading = true;
            draft.pickup={};
            break;  
        case REQUEST_GET_LIBRARY_DESK_SUCCESS:
              draft.loading = false;
              draft.error = initialState.error;            
              draft.pickup = action.result.data;
              break;    


      case REQUEST_BORROWINGS_LIST:
        draft.loading = true;
        break;
      case REQUEST_BORROWINGS_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.borrowingsList.data = action.result.data;
        draft.borrowingsList.pagination = action.result.meta.pagination
        break;
      
      case REQUEST_BORROWINGSTODELIVER_LIST:
        draft.loading = true;
        break;
      case REQUEST_BORROWINGSTODELIVER_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.borrowingsList.data = action.result.data;
        draft.borrowingsList.pagination = action.result.meta.pagination
        break;  

      case REQUEST_POST_NEW_BORROWING:
        //draft.loading=true;
        break;   
        
      case REQUEST_GET_BORROWING:
          draft.loading = true;
          draft.borrowing={};
          break;  
      case REQUEST_GET_BORROWING_SUCCESS:
            draft.loading = false;
            draft.error = initialState.error;            
            draft.borrowing = action.result.data;
            break; 

      case REQUEST_GET_LENDING:
          draft.loading = true;
          draft.lending={};
          break;  
      case REQUEST_GET_LENDING_SUCCESS:
          draft.loading = false;
          draft.error = initialState.error;        
          draft.lending = action.result.data;
          break; 

      case REQUEST_UPDATE_BORROWING:
      case REQUEST_FORWARD_BORROWING:
        draft.loading = true;
        draft.borrowing={};
        break;              
        
      case REQUEST_UPDATE_BORROWING_SUCCESS: 
      case REQUEST_FORWARD_BORROWING_SUCCESS: 
            draft.loading = false;
            draft.error = initialState.error;            
            draft.borrowing = action.result.data;
      break;    
      
      case REQUEST_FIND_UPDATE_BORROWING_OA:        
        draft.borrowingsList.oaloading.push(action.id)
        break;    
      case REQUEST_FIND_UPDATE_BORROWING_OA_SUCCESS:
          draft.borrowingsList.oaloading = action.result?draft.borrowingsList.oaloading.filter(function(e) { return e !== action.result }):null  
          break;      
      case REQUEST_FIND_UPDATE_BORROWING_OA_FAIL:
        draft.borrowingsList.oaloading = action.result?draft.borrowingsList.oaloading.filter(function(e) { return e !== action.result }):null
        break;          
      case REQUEST_LENDINGS_LIST:
        draft.loading = true;
        break;
      case REQUEST_LENDINGS_LIST_SUCCESS:
        draft.loading = false;
        draft.error = initialState.error;
        draft.lendingsList.data = action.result.data;
        draft.lendingsList.pagination = action.result.meta.pagination
        break;          

        case REQUEST_GET_COUNTRIES_OPTIONLIST:
          draft.error = action.error;
          break;
        case REQUEST_GET_COUNTRIES_OPTIONLIST_SUCCESS:
          draft.error = initialState.error;
          draft.countriesOptionList = action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );
          break;
        case REQUEST_LIBRARYSUBJECT_OPTIONLIST:
          draft.error = action.error;
          break;
        case REQUEST_LIBRARYSUBJECT_OPTIONLIST_SUCCESS:
          draft.error = initialState.error;
          draft.librarySubjectOptionList = action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );
          break;  

        case REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST:
          draft.error = action.error;
          break;
        case REQUEST_LIBRARYIDENTIFIER_TYPES_OPTIONLIST_SUCCESS:
          draft.error = initialState.error;
          draft.libraryIdentifierTypesOptionList = action.result.sort((a, b) => { return (a.id > b.id) ? 1 : -1 }).map(item => { return {value: item.id, label: item.name} } );
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

          case REQUEST_GET_LIBRARY_OPERATORS:
            draft.loading = true;
            draft.error = initialState.error;             
            break;

            case REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS:
              draft.loading = false;
              draft.error = initialState.error;             
              break; 
              
            
              case REQUEST_GET_LIBRARY_OPERATOR:
                draft.loading = false;
                draft.error = initialState.error;             
                break;  
                    

        case REQUEST_GET_LIBRARY_OPERATORS_SUCCESS:
          draft.loading = false;          
          draft.error = initialState.error; 
          draft.operators = action.result;
          break;

          case REQUEST_GET_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS:
            draft.loading = false;         
            draft.error = initialState.error; 
            draft.operatorPerm = action.result;            
            break;  


          case REQUEST_GET_LIBRARY_OPERATOR_SUCCESS:
            draft.loading = false;         
            draft.error = initialState.error; 
            draft.operator = action.result.data;            
            break;  

          case REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS:
            draft.error = initialState.error;               
            break;  
            
          /*case REQUEST_UPDATE_LIBRARY_OPERATOR_PERMISSIONS_SUCCESS:           
            draft.loading = false;          
            draft.error = initialState.error; 
            draft.operators = action.result;
          break;  */  
            
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
          
        case REQUEST_INVITE_LIBRARY_OPERATOR:
          draft.error = initialState.error;               
          break;                      
        
        case REQUEST_GET_LIBRARY_PENDING_OPERATORS_SUCCESS:
            draft.error = initialState.error; 
            draft.pending_operators = action.result.data;
            break;  
            
        case REQUEST_GET_USERS_OPTION_ITEMS: 
              draft.error = action.error;
              break;
        case REQUEST_GET_USERS_OPTION_ITEMS_SUCCESS: 
              draft.loading = false;     
              draft.error = initialState.error; 
              draft.searchUsersOptionList=action.result    
        break;
            
        
        
        case REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR:
          draft.error = initialState.error;               
          break;   
                    
        case REQUEST_REMOVE_LIBRARY_PENDING_OPERATOR_SUCCESS:
          draft.loading = false;          
          draft.error = initialState.error; 
          draft.pending_operators = action.result.data;
          break;    


          

      case UPLOAD_PROGRESS:
          draft.loading = false;
          draft.error = initialState.error;

      case UPLOAD_REQUEST:
          draft.loading = false;
          draft.error = initialState.error;
          break;

      case UPLOAD_SUCCESS:
          draft.loading = false;
          draft.error = initialState.error;
          draft.fileupload  = action.result;
          break;  
          
      case UPLOAD_FAILURE:
          draft.loading = true;
          draft.error = initialState.error;
          break;

        // case DOWNLOAD_REQUEST:
        //     draft.filedownload.push(action.id)
        //     // draft.loading = false;
        //     // draft.error = initialState.error;
        //     break;
  
        // case DOWNLOAD_SUCCESS:
        //     draft.loading = false;
        //     draft.error = initialState.error;
        //     draft.filedownload  = action.result
        //     draft.filedownload = Object.values(action.result).filter(c => c.id !== draft.filedownload.id)
        //  break;  
            
        // case DOWNLOAD_FAILURE:
        //     draft.loading = true;
        //     draft.error = initialState.error;
        //     break;
      case REQUEST_GET_ISSN_ISBN:
        draft.error = initialState.error;    
        draft.findISSNISBNresults.loading=true;  
        draft.findISSNISBNresults.data=[]
        break;

      case REQUEST_GET_ISSN_ISBN_SUCCESS:
          draft.findISSNISBNresults.loading=false;  
          draft.error = initialState.error;       
          draft.findISSNISBNresults.data=action.result.data
          break;  

      case REQUEST_GET_ISSN_ISBN_FAIL:
        draft.findISSNISBNresults.loading=false;  
        draft.error=action.result
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
