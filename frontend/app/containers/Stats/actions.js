import {
  FETCH_FILL_RATE_REQUEST, 
  FETCH_FILL_RATE_SUCCESS, 
  FETCH_FILL_RATE_FAILURE,
  FETCH_REQUEST_DISTRIBUTION_REQUEST,
  FETCH_REQUEST_DISTRIBUTION_SUCCESS,
  FETCH_REQUEST_DISTRIBUTION_FAILURE,
} from './constants';

// Fill rate stats

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
});

// Request distribution stats

export const fetchRequestDistributionRequest = (year, library_id, institution_id, material_type) => ({
  type: FETCH_REQUEST_DISTRIBUTION_REQUEST,
  year,
  library_id,
  institution_id,
  material_type
});

export const fetchRequestDistributionSuccess = data => ({
  type: FETCH_REQUEST_DISTRIBUTION_SUCCESS,
  payload: data
});

export const fetchRequestDistributionFailure = error => ({
  type: FETCH_REQUEST_DISTRIBUTION_FAILURE,
  payload: error
});