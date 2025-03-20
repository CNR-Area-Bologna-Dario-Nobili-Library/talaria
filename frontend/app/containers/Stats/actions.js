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

// Countries distribution stats

export const fetchCountriesDistributionRequest = (year, country_id, library_id, institution_id) => ({
  type: FETCH_COUNTRIES_DISTRIBUTION_REQUEST,
  year,
  country_id,
  library_id,
  institution_id
});

export const fetchCountriesDistributionSuccess = data => ({
  type: FETCH_COUNTRIES_DISTRIBUTION_SUCCESS,
  payload: data
});

export const fetchCountriesDistributionFailure = error => ({
  type: FETCH_COUNTRIES_DISTRIBUTION_FAILURE,
  payload: error
});

// Working time distribution stats

export const fetchWorkingTimeRequest = (year, library_id, institution_id, material_type) => ({
  type: FETCH_WORKING_TIME_REQUEST,
  year,
  library_id,
  institution_id,
  material_type
});

export const fetchWorkingTimeSuccess = data => ({
  type: FETCH_WORKING_TIME_SUCCESS,
  payload: data
});

export const fetchWorkingTimeFailure = error => ({
  type: FETCH_WORKING_TIME_FAILURE,
  payload: error
});

// Average working time stats

export const fetchAvgWorkingtimeRequest = (year, library_id, institution_id, material_type) => ({
  type: FETCH_AVG_WORKING_TIME_REQUEST,
  year,
  library_id,
  institution_id,
  material_type
});

export const fetchAvgWorkingTimeSuccess = data => ({
  type: FETCH_AVG_WORKING_TIME_SUCCESS,
  payload: data
});

export const fetchAvgWorkingTimeFailure = error => ({
  type: FETCH_AVG_WORKING_TIME_FAILURE,
  payload: error
});