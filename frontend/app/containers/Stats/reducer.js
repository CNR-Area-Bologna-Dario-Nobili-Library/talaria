import produce from 'immer';
import {
  FETCH_FILL_RATE_REQUEST, 
  FETCH_FILL_RATE_SUCCESS, 
  FETCH_FILL_RATE_FAILURE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  fill_rate: null,
};

const statsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
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

      default:
        break;
    }
  });

export default statsReducer;