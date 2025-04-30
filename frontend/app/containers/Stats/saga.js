import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_AVG_WORKING_TIME_REQUEST,
  FETCH_COUNTRIES_DISTRIBUTION_REQUEST,
  FETCH_FILL_RATE_REQUEST,
  FETCH_OPENACCESS_REFERENCES_REQUEST,
  FETCH_REFERENCE_PUBYEAR_DISTRIBUTION_REQUEST,
  FETCH_REFERENCE_TURNAROUND_REQUEST,
  FETCH_REQUEST_DISTRIBUTION_REQUEST,
  FETCH_REQUESTS_LIBRARY_REQUEST,
  FETCH_WORKING_TIME_REQUEST,
} from './constants';
import {
  fetchFillRateSuccess,
  fetchFillRateFailure,
  fetchRequestDistributionSuccess,
  fetchRequestDistributionFailure,
  fetchCountriesDistributionSuccess,
  fetchCountriesDistributionFailure,
  fetchWorkingTimeSuccess,
  fetchWorkingTimeFailure,
  fetchAvgWorkingTimeSuccess,
  fetchAvgWorkingTimeFailure,
  fetchReferenceTurnaroundSuccess,
  fetchReferenceTurnaroundFailure,
  fetchReferencePubyearDistributionSuccess,
  fetchReferencePubyearDistributionFailure,
  fetchRequestsPerLibrarySuccess,
  fetchRequestsPerLibraryFailure,
  fetchOpenAccessReferencesSuccess,
  fetchOpenAccessReferencesFailure,
} from './actions';
import {
  avgWorkingTime,
  countriesDistribution,
  getFillrate,
  openAccessReferences,
  referencePubyearDistribution,
  referenceTurnaround,
  requestDistribution,
  requestsPerLibrary,
  workingTime,
} from '../../utils/api';

function* fetchFillRateSaga(action) {
  console.log('fetchfillratesaga triggered with action:', action);
  try {
    const options = {
      year: action.year,
      library_id: action.library_id,
      institution_id: action.institution_id,
      country_id: action.country_id,
    };
    const data = yield call(getFillrate, options);
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
      country_id: action.country_id,
      material_type: action.material_type,
    };
    const data = yield call(requestDistribution, options);
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
      institution_id: action.institution_id,
    };
    const data = yield call(countriesDistribution, options);
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
      country_id: action.country_id,
      material_type: action.material_type,
    };
    const data = yield call(workingTime, options);
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
      country_id: action.country_id,
      material_type: action.material_type,
    };
    const data = yield call(avgWorkingTime, options);
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
      country_id: action.country_id,
    };
    const data = yield call(referenceTurnaround, options);
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
      country_id: action.country_id,
      material_type: action.material_type,
    };
    const data = yield call(referencePubyearDistribution, options);
    yield put(fetchReferencePubyearDistributionSuccess(data));
  } catch (error) {
    yield put(fetchReferencePubyearDistributionFailure(error.message));
  }
}

function* fetchRequestsPerLibrarySaga() {
  try {
    const data = yield call(requestsPerLibrary);
    yield put(fetchRequestsPerLibrarySuccess(data));
  } catch (error) {
    yield put(fetchRequestsPerLibraryFailure(error.message));
  }
}

function* fetchOpenAccessReferencesSaga() {
  try {
    const data = yield call(openAccessReferences);
    yield put(fetchOpenAccessReferencesSuccess(data));
  } catch (error) {
    yield put(fetchOpenAccessReferencesFailure(error.message));
  }
}

export default function* statsSaga() {
  console.log('statsSaga');
  yield takeLatest(FETCH_FILL_RATE_REQUEST, fetchFillRateSaga);
  yield takeLatest(
    FETCH_REQUEST_DISTRIBUTION_REQUEST,
    fetchRequestsDistributionSaga,
  );
  yield takeLatest(
    FETCH_COUNTRIES_DISTRIBUTION_REQUEST,
    fetchCountriesDistributionSaga,
  );
  yield takeLatest(FETCH_WORKING_TIME_REQUEST, fetchWorkingTimeSaga);
  yield takeLatest(FETCH_AVG_WORKING_TIME_REQUEST, fetchAvgWorkingTimeSaga);
  yield takeLatest(
    FETCH_REFERENCE_TURNAROUND_REQUEST,
    fetchReferenceTurnaroundSaga,
  );
  yield takeLatest(
    FETCH_REFERENCE_PUBYEAR_DISTRIBUTION_REQUEST,
    fetchReferencePubyearDistributionSaga,
  );
  yield takeLatest(FETCH_REQUESTS_LIBRARY_REQUEST, fetchRequestsPerLibrarySaga);
  yield takeLatest(
    FETCH_OPENACCESS_REFERENCES_REQUEST,
    fetchOpenAccessReferencesSaga,
  );
}
