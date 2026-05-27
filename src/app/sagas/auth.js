import { call, put, takeLatest } from 'redux-saga/effects';
import { authGoogleLogin, authLogin } from '../api/auth';
import { fetchMe } from '../api/user';
import {
  userLoginCompleted,
  userLoginError,
  userLoginRequest,
  USER_LOGIN,
} from '../actions';

function* loginSaga(action) {
  try {
    const isGoogle = action?.payload?.provider === 'google';
    console.log('[loginSaga] USER_LOGIN received', {
      provider: isGoogle ? 'google' : 'password',
      hasUsername: Boolean(action?.payload?.username),
      hasPassword: Boolean(action?.payload?.password),
    });
    yield put(userLoginRequest());

    const data = isGoogle
      ? yield call(authGoogleLogin)
      : yield call(authLogin, action.payload);
    let user = data?.user ?? null;
    if (data?.token) {
      try {
        const me = yield call(fetchMe);
        user = me?.data ?? user;
      } catch {
        // profile loads on Profile tab if /me fails here
      }
    }

    yield put(
      userLoginCompleted({
        token: data?.token ?? null,
        user,
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