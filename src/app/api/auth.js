import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/api';
import apiConfig from '../../config/api.config';

const BASE_URL = API_BASE_URL;

const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

let googleConfigured = false;
let googleModule = null;

function loadGoogleModule() {
  if (googleModule) {
    return googleModule;
  }
  try {
    // Load lazily so app startup stays stable even if native module is unavailable.
    // eslint-disable-next-line global-require
    googleModule = require('@react-native-google-signin/google-signin');
    return googleModule;
  } catch {
    return null;
  }
}

function ensureGoogleConfigured() {
  const module = loadGoogleModule();
  if (!module?.GoogleSignin) {
    return false;
  }
  if (googleConfigured) {
    return true;
  }

  module.GoogleSignin.configure({
    webClientId: apiConfig.GOOGLE_WEB_CLIENT_ID || undefined,
    offlineAccess: false,
  });
  googleConfigured = true;
  return true;
}

export function isGoogleLoginAvailable() {
  return Boolean(apiConfig.GOOGLE_WEB_CLIENT_ID) && Boolean(loadGoogleModule()?.GoogleSignin);
}

export async function authLogin({ username, password }) {
  console.log('[authLogin] POST', BASE_URL + '/login', { username });
  let response;

  try {
    response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      ...options,
      body: JSON.stringify({ username, password }),
    });
  } catch (error) {
    console.error('[authLogin] backend connection FAILED', {
      url: BASE_URL + '/login',
      message: error?.message,
    });
    throw new Error(
      `Cannot connect to backend server (${BASE_URL}). Check Wi‑Fi, VPN, and api.config — use Railway or your Mac’s LAN IP on a real phone (not 10.0.2.2).`,
    );
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
    const msg =
      data?.message ||
      data?.error ||
      data?.detail ||
      data?.title ||
      (typeof data === 'string' ? data : null) ||
      'Login failed';
    throw new Error(String(msg));
  }
}

export async function authLogout() {
  await AsyncStorage.removeItem('jwt_token');
}

export async function authGoogleLogin() {
  const module = loadGoogleModule();
  const configured = ensureGoogleConfigured();

  if (!configured || !module?.GoogleSignin || !apiConfig.GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'Google login is not configured. Set GOOGLE_WEB_CLIENT_ID and ensure Google Sign-In native setup is complete.',
    );
  }

  try {
    await module.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await module.GoogleSignin.signIn();
    const idToken = userInfo?.data?.idToken || userInfo?.idToken;

    if (!idToken) {
      throw new Error('Google did not return an ID token.');
    }

    const response = await fetch(BASE_URL + '/v1/login/google', {
      method: 'POST',
      ...options,
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || 'Google login failed');
    }

    if (data?.token) {
      await AsyncStorage.setItem('jwt_token', data.token);
    }

    return data;
  } catch (error) {
    if (error?.code === module.statusCodes?.SIGN_IN_CANCELLED) {
      throw new Error('Google sign-in was cancelled.');
    }
    if (error?.code === module.statusCodes?.IN_PROGRESS) {
      throw new Error('Google sign-in already in progress.');
    }
    if (error?.code === module.statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services not available.');
    }
    throw error;
  }
}

export async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('jwt_token');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}