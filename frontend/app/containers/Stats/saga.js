import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_AVG_WORKING_TIME_REQUEST, FETCH_COUNTRIES_DISTRIBUTION_REQUEST, FETCH_FILL_RATE_REQUEST, FETCH_REFERENCE_PUBYEAR_DISTRIBUTION_REQUEST, FETCH_REFERENCE_TURNAROUND_REQUEST, FETCH_REQUEST_DISTRIBUTION_REQUEST, FETCH_REQUESTS_LIBRARY_REQUEST, FETCH_WORKING_TIME_REQUEST } from './constants';
import { fetchFillRateSuccess, fetchFillRateFailure, fetchRequestDistributionSuccess, fetchRequestDistributionFailure, fetchCountriesDistributionSuccess, fetchCountriesDistributionFailure, fetchWorkingTimeSuccess, fetchWorkingTimeFailure, fetchAvgWorkingTimeSuccess, fetchAvgWorkingTimeFailure, fetchReferenceTurnaroundSuccess, fetchReferenceTurnaroundFailure, fetchReferencePubyearDistributionSuccess, fetchReferencePubyearDistributionFailure, fetchRequestsPerLibrarySuccess, fetchRequestsPerLibraryFailure } from './actions';
import { admin_avgWorkingTime, admin_countriesDistribution, admin_getFillrate, admin_referencePubyearDistribution, admin_referenceTurnaround, admin_requestDistribution, admin_requestsPerLibrary, admin_workingTime } from '../../utils/apiAdmin';

function* fetchFillRateSaga(action) {
  console.log("fetchfillratesaga triggered with action:", action);
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id
    };
    const data = yield call(admin_getFillrate, options);
    yield put(fetchFillRateSuccess(data));
  } catch (error) {
    yield put(fetchFillRateFailure(error.message));
  }
}

function* fetchRequestsDistributionSaga(action) {
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
      material_type: action.material_type
    };
    const data = yield call(admin_requestDistribution, options);
    yield put(fetchRequestDistributionSuccess(data));
  } catch (error) {
    yield put(fetchRequestDistributionFailure(error.message));
  }
}

function* fetchCountriesDistributionSaga(action) {
  try {
    const options = {
      year: action.year,
      country_id: action.country_id,
      library_id: action.library_id,
      institution_id: action.institution_id
    };
    const data = yield call(admin_countriesDistribution, options);
    yield put(fetchCountriesDistributionSuccess(data));
  } catch (error) {
    yield put(fetchCountriesDistributionFailure(error.message));
  }
}

function* fetchWorkingTimeSaga(action) {
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
      material_type: action.material_type
    };
    const data = yield call(admin_workingTime, options);
    yield put(fetchWorkingTimeSuccess(data));
  } catch (error) {
    yield put(fetchWorkingTimeFailure(error.message));
  }
}

function* fetchAvgWorkingTimeSaga(action) {
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
      material_type: action.material_type
    };
    const data = yield call(admin_avgWorkingTime, options);
    yield put(fetchAvgWorkingTimeSuccess(data));
  } catch (error) {
    yield put(fetchAvgWorkingTimeFailure(error.message));
  }
}

function* fetchReferenceTurnaroundSaga(action) {
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
    };
    const data = yield call(admin_referenceTurnaround, options);
    yield put(fetchReferenceTurnaroundSuccess(data));
  } catch (error) {
    yield put(fetchReferenceTurnaroundFailure(error.message));
  }
}

function* fetchReferencePubyearDistributionSaga(action) {
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
      material_type: action.material_type,
    };
    const data = yield call(admin_referencePubyearDistribution, options);
    yield put(fetchReferencePubyearDistributionSuccess(data));
  } catch (error) {
    yield put(fetchReferencePubyearDistributionFailure(error.message));
  }
}

function* fetchRequestsPerLibrarySaga() {
  try {
    const data = yield call(admin_requestsPerLibrary);
    yield put(fetchRequestsPerLibrarySuccess(data));
  } catch (error) {
    yield put(fetchRequestsPerLibraryFailure(error.message));
  }
}

export default function* statsSaga() {
  console.log("statsSaga");
  yield takeLatest(FETCH_FILL_RATE_REQUEST, fetchFillRateSaga);
  yield takeLatest(FETCH_REQUEST_DISTRIBUTION_REQUEST, fetchRequestsDistributionSaga);
  yield takeLatest(FETCH_COUNTRIES_DISTRIBUTION_REQUEST, fetchCountriesDistributionSaga);
  yield takeLatest(FETCH_WORKING_TIME_REQUEST, fetchWorkingTimeSaga);
  yield takeLatest(FETCH_AVG_WORKING_TIME_REQUEST, fetchAvgWorkingTimeSaga);
  yield takeLatest(FETCH_REFERENCE_TURNAROUND_REQUEST, fetchReferenceTurnaroundSaga);
  yield takeLatest(FETCH_REFERENCE_PUBYEAR_DISTRIBUTION_REQUEST, fetchReferencePubyearDistributionSaga);
  yield takeLatest(FETCH_REQUESTS_LIBRARY_REQUEST, fetchRequestsPerLibrarySaga);
} 