import produce from 'immer';
import {
  FETCH_AVG_TIME_REQUEST,
  FETCH_AVG_TIME_SUCCESS,
  FETCH_AVG_TIME_FAILURE,
  FETCH_BORROWING_REQUESTS,
  FETCH_BORROWING_REQUESTS_SUCCESS,
  FETCH_BORROWING_REQUESTS_FAILURE,
  FETCH_LIBRARIES_REQUEST,
  FETCH_LIBRARIES_SUCCESS,
  FETCH_LIBRARIES_FAILURE,
  FETCH_COUNTRIES_REQUEST,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  avg_working_time_data: null,
  borrowing_requests_data: null,
  libraries: null,
  countries: null
};

const statsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FETCH_AVG_TIME_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
  
      case FETCH_AVG_TIME_SUCCESS:
        draft.loading = false;
        draft.avg_working_time_data = action.payload;
        break;
      
      case FETCH_AVG_TIME_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
  
      case FETCH_BORROWING_REQUESTS:
        draft.loading = true;
        draft.error = null;
        break;
  
      case FETCH_BORROWING_REQUESTS_SUCCESS:
        draft.loading = false;
        draft.borrowing_requests_data = action.payload;
        break;
      
      case FETCH_BORROWING_REQUESTS_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
  
      case FETCH_LIBRARIES_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
  
      case FETCH_LIBRARIES_SUCCESS:
        draft.loading = false;
        draft.libraries = action.payload;
        break;
  
      case FETCH_LIBRARIES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
  
      case FETCH_COUNTRIES_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
  
      case FETCH_COUNTRIES_SUCCESS:
        draft.loading = false;
        draft.countries = action.payload;
        break;
  
      case FETCH_COUNTRIES_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      default:
        break;
    }
  });

export default statsReducer;