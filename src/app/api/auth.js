import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://127.0.0.1:8000/api';

const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function authLogin({ email, password }) {
  console.log('[authLogin] POST', BASE_URL + '/login', { email });
  let response;

  try {
    response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      ...options,
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error('[authLogin] backend connection FAILED', {
      url: BASE_URL + '/login',
      message: error?.message,
    });
    throw new Error('Cannot connect to backend server');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('[authLogin] JSON parse failed', e);
    throw new Error('Invalid server response');
  }

  console.log('[authLogin] backend connection SUCCESS', {
    url: BASE_URL + '/login',
    ok: response.ok,
    status: response.status,
  });

  console.log('[authLogin] response body summary', {
    ok: response.ok,
    status: response.status,
    hasToken: Boolean(data?.token),
    hasMessage: Boolean(data?.message),
  });

  if (response.ok) {
    if (data.token) {
      await AsyncStorage.setItem('jwt_token', data.token);
      const storedToken = await AsyncStorage.getItem('jwt_token');
      console.log('[authLogin] token stored?', Boolean(storedToken));
    }
    return data;
  } else {
    console.error('[authLogin] login failed body', data);
    throw new Error(data.message || 'Login failed');
  }
}

export async function authLogout() {
  await AsyncStorage.removeItem('jwt_token');
}

export async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('jwt_token');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}