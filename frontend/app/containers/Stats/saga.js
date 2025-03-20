import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_COUNTRIES_DISTRIBUTION_REQUEST, FETCH_FILL_RATE_REQUEST, FETCH_REQUEST_DISTRIBUTION_REQUEST, FETCH_WORKING_TIME_REQUEST } from './constants';
import { fetchFillRateSuccess, fetchFillRateFailure, fetchRequestDistributionSuccess, fetchRequestDistributionFailure, fetchCountriesDistributionSuccess, fetchCountriesDistributionFailure, fetchWorkingTimeSuccess, fetchWorkingTimeFailure } from './actions';
import { admin_countriesDistribution, admin_getFillrate, admin_requestDistribution, admin_workingTime } from '../../utils/apiAdmin';

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

export default function* statsSaga() {
  console.log("statsSaga");
  yield takeLatest(FETCH_FILL_RATE_REQUEST, fetchFillRateSaga);
  yield takeLatest(FETCH_REQUEST_DISTRIBUTION_REQUEST, fetchRequestsDistributionSaga);
  yield takeLatest(FETCH_COUNTRIES_DISTRIBUTION_REQUEST, fetchCountriesDistributionSaga);
  yield takeLatest(FETCH_WORKING_TIME_REQUEST, fetchWorkingTimeSaga);
} 