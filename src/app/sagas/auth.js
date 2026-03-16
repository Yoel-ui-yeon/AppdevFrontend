import { call, put, takeLatest } from 'redux-saga/effects';
import { authLogin } from '../api/auth';
import {
  userLoginCompleted,
  userLoginError,
  userLoginRequest,
  USER_LOGIN,
} from '../actions';

function* loginSaga(action) {
  try {
    console.log('[loginSaga] USER_LOGIN received', {
      hasEmail: Boolean(action?.payload?.email),
      hasPassword: Boolean(action?.payload?.password),
    });
    yield put(userLoginRequest());

    const data = yield call(authLogin, action.payload);
    console.log('[loginSaga] authLogin returned', {
      hasToken: Boolean(data?.token),
      hasUser: Boolean(data?.user),
    });

    yield put(
      userLoginCompleted({
        token: data?.token ?? null,
        user: data?.user ?? null,
      }),
    );
  } catch (error) {
    console.error('[loginSaga] login failed', error);
    yield put(userLoginError(error?.message || 'Login failed'));
  }
}

export function* userLogin() {
  yield takeLatest(USER_LOGIN, loginSaga);
}