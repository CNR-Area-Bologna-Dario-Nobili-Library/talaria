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

console.log("actions.js");

export const fetchAvgTimeRequest = (year) => ({
  type: FETCH_AVG_TIME_REQUEST,
  year
});

export const fetchAvgTimeSuccess = data => ({
  type: FETCH_AVG_TIME_SUCCESS,
  payload: data
});

export const fetchAvgTimeFailure = error => ({
  type: FETCH_AVG_TIME_FAILURE,
  payload: error
});

export const fetchBorrowingRequests = (year, borrowing_library_id, material_type, borrowing_status, fulfill_type, notfulfill_type) => ({
  type: FETCH_BORROWING_REQUESTS,
  year,
  borrowing_library_id,
  material_type,
  borrowing_status,
  fulfill_type,
  notfulfill_type
});

export const fetchBorrowingRequestsSuccess = data => ({
  type: FETCH_BORROWING_REQUESTS_SUCCESS,
  payload: data
});

export const fetchBorrowingRequestsFailure = error => ({
  type: FETCH_BORROWING_REQUESTS_FAILURE,
  payload: error
});

export const fetchLibrariesRequest = () => ({
  type: FETCH_LIBRARIES_REQUEST
});

export const fetchLibrariesSuccess = data => ({
  type: FETCH_LIBRARIES_SUCCESS,
  payload: data
});

export const fetchLibrariesFailure = error => ({
  type: FETCH_LIBRARIES_FAILURE,
  payload: error
});

export const fetchCountriesRequest = () => ({
  type: FETCH_COUNTRIES_REQUEST
});

export const fetchCountriesSuccess = data => ({
  type: FETCH_COUNTRIES_SUCCESS,
  payload: data
});

export const fetchCountriesFailure = error => ({
  type: FETCH_COUNTRIES_FAILURE,
  payload: error
});