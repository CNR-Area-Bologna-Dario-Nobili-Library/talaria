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
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  fill_rate: null,
  request_distribution: null,
  countries_distribution: null,
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

      case FETCH_COUNTRIES_DISTRIBUTION_SUCCESS:
        draft.loading = false;
        draft.error = action.payload;
        break;

      default:
        break;
    }
  });

export default statsReducer;