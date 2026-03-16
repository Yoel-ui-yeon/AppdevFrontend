import {
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
} from '../actions';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST: {
      console.log('[authReducer] USER_LOGIN_REQUEST');
      return { ...state, isLoading: true, error: null };
    }

    case USER_LOGIN_COMPLETED: {
      console.log('[authReducer] USER_LOGIN_COMPLETED token?', Boolean(action?.payload?.token));
      return {
        ...state,
        isLoading: false,
        user: action.payload?.user ?? null,
        token: action.payload?.token ?? null,
        error: null,
      };
    }

    case USER_LOGIN_ERROR: {
      console.error('[authReducer] USER_LOGIN_ERROR', action.payload);
      return { ...state, isLoading: false, error: action.payload };
    }

    case USER_LOGIN_RESET: {
      console.log('[authReducer] USER_LOGIN_RESET');
      return { ...initialState };
    }

    default:
      return state;
  }
}