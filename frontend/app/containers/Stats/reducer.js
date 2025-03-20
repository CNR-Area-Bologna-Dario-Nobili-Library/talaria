import produce from 'immer';
import {
  FETCH_FILL_RATE_REQUEST, 
  FETCH_FILL_RATE_SUCCESS, 
  FETCH_FILL_RATE_FAILURE,
  FETCH_REQUEST_DISTRIBUTION_REQUEST,
  FETCH_REQUEST_DISTRIBUTION_SUCCESS,
  FETCH_REQUEST_DISTRIBUTION_FAILURE,
  FETCH_COUNTRIES_DISTRIBUTION_REQUEST,
  FETCH_COUNTRIES_DISTRIBUTION_SUCCESS,
  FETCH_COUNTRIES_DISTRIBUTION_FAILURE,
  FETCH_WORKING_TIME_REQUEST,
  FETCH_WORKING_TIME_SUCCESS,
  FETCH_WORKING_TIME_FAILURE,
  FETCH_AVG_WORKING_TIME_REQUEST,
  FETCH_AVG_WORKING_TIME_SUCCESS,
  FETCH_AVG_WORKING_TIME_FAILURE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  fill_rate: null,
  request_distribution: null,
  countries_distribution: null,
  working_time: null,
  avg_working_time: null,
};

const statsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      // Fill rate stats

      case FETCH_FILL_RATE_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_FILL_RATE_SUCCESS:
        draft.loading = false;
        draft.fill_rate = action.payload;
        break;

      case FETCH_FILL_RATE_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      // Request distribution stats

      case FETCH_REQUEST_DISTRIBUTION_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_REQUEST_DISTRIBUTION_SUCCESS:
        draft.loading = false;
        draft.request_distribution = action.payload
        break;

      case FETCH_REQUEST_DISTRIBUTION_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      // Countries distribution stats

      case FETCH_COUNTRIES_DISTRIBUTION_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_COUNTRIES_DISTRIBUTION_SUCCESS:
        draft.loading = false;
        draft.countries_distribution = action.payload;
        break;

      case FETCH_COUNTRIES_DISTRIBUTION_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      // Working time distribution stats

      case FETCH_WORKING_TIME_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_WORKING_TIME_SUCCESS:
        draft.loading = false;
        draft.working_time = action.payload;
        break;

      case FETCH_WORKING_TIME_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      // Average working time stats

      case FETCH_AVG_WORKING_TIME_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_AVG_WORKING_TIME_SUCCESS:
        draft.loading = false;
        draft.avg_working_time = action.payload;
        break;

      case FETCH_AVG_WORKING_TIME_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      default:
        break;
    }
  });

export default statsReducer;