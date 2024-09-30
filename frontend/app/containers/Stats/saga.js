import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_AVG_TIME_REQUEST, FETCH_BORROWING_REQUESTS, FETCH_LIBRARIES_REQUEST, FETCH_COUNTRIES_REQUEST } from './constants';
import { fetchAvgTimeSuccess, fetchAvgTimeFailure, fetchBorrowingRequestsSuccess, fetchBorrowingRequestsFailure, fetchLibrariesSuccess, fetchLibrariesFailure, fetchCountriesSuccess, fetchCountriesFailure } from './actions';
import { admin_getAvgWorkingTime, admin_getBorrowingRequests } from '../../utils/apiAdmin';
import { getLibraryOptionList, getCountriesOptionsList } from '../../utils/api';

function* fetchAvgTimeSaga(action) {
  // console.log("fetchAvgTimeSaga", action);
  try {
    // console.log("fetchAvgTimeSaga A", action);
    // console.log("fetchAvgTimeSaga", admin_getAvgWorkingTime);
    // alert("Blabla");
    // action.year = 2024;
    const options = { year: action.year };
    const data = yield call(admin_getAvgWorkingTime, options);
    // console.log("fetchAvgTimeSaga B");
    yield put(fetchAvgTimeSuccess(data));
  } catch (error) {
    // alert("saga " + error.message);
    console.log("fetchAvgTimeSaga failed:", error.message);
    yield put(fetchAvgTimeFailure(error.message));
  }
}

export function* fetchBorrowingRequestsSaga(action) {
  try {
    const options = { year: action.year, borrowing_library_id: action.borrowing_library_id, material_type: action.material_type, borrowing_status: action.borrowing_status, fulfill_type: action.fulfill_type, notfulfill_type: action.notfulfill_type };
    const data = yield call(admin_getBorrowingRequests, options);
    yield put(fetchBorrowingRequestsSuccess(data));
  } catch (error) {
    yield put(fetchBorrowingRequestsFailure(error.message));
  }
}

export function* fetchLibrariesSaga() {
  try {
    const options = {}
    const data = yield call(getLibraryOptionList, options);
    yield put(fetchLibrariesSuccess(data));
  } catch (error) {
    yield put(fetchLibrariesFailure(error.message));
  }
}

export function* fetchCountriesSaga() {
  try {
    const options = {}
    const data = yield call(getCountriesOptionsList, options);
    yield put(fetchCountriesSuccess(data));
  } catch (error) {
    yield put(fetchCountriesFailure(error.message));
  }
}

export default function* statsSaga() {
  console.log("statsSaga");
  yield takeLatest(FETCH_AVG_TIME_REQUEST, fetchAvgTimeSaga);
  yield takeLatest(FETCH_BORROWING_REQUESTS, fetchBorrowingRequestsSaga);
  yield takeLatest(FETCH_LIBRARIES_REQUEST, fetchLibrariesSaga);
  yield takeLatest(FETCH_COUNTRIES_REQUEST, fetchCountriesSaga);
} 