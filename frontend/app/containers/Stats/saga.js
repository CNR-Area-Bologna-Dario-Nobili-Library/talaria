import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_FILL_RATE_REQUEST } from './constants';
import { fetchFillRateSuccess, fetchFillRateFailure } from './actions';
import { admin_getFillrate } from '../../utils/apiAdmin';

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

export default function* statsSaga() {
  console.log("statsSaga");
  yield takeLatest(FETCH_FILL_RATE_REQUEST, fetchFillRateSaga);
} 