import {
  FETCH_FILL_RATE_REQUEST, 
  FETCH_FILL_RATE_SUCCESS, 
  FETCH_FILL_RATE_FAILURE
} from './constants';

export const fetchFillRateRequest = (year, library_id, institution_id) => ({
  type: FETCH_FILL_RATE_REQUEST,
  year,
  library_id,
  institution_id
});

export const fetchFillRateSuccess = data => ({
  type: FETCH_FILL_RATE_SUCCESS,
  payload: data
});

export const fetchFillRateFailure = error => ({
  type: FETCH_FILL_RATE_FAILURE,
  payload: error
})