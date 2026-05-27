/**
 * Backend connection for the mobile app.
 *
 * 1. Copy api.config.local.example.js → api.config.local.js
 * 2. Paste your Railway public URL (finals-webdev → Settings → Networking → domain)
 * 3. Set USE_RAILWAY_BACKEND: true
 *
 * Local app + Railway API = admin/mobile share the same database on Railway.
 */

const defaults = {
  /** Public HTTPS URL, must end with /api */
  RAILWAY_API_BASE: 'https://finals-webdev-production.up.railway.app/api',

  /** true → deployed Cloudrobe on Railway; false → local Symfony */
  USE_RAILWAY_BACKEND: true,

  /**
   * When USE_RAILWAY_BACKEND is false, this is the API root (must end with /api).
   * Android emulator cannot use 127.0.0.1 — use http://10.0.2.2:8000/api in api.config.local.js.
   * iOS simulator can use http://127.0.0.1:8000/api.
   */
  LOCAL_API_BASE: 'http://127.0.0.1:8000/api',

  /** Refetch lists while a screen is open (admin/staff updates appear automatically) */
  AUTO_REFRESH_MS: 15000,

  /**
   * Firebase Web client ID (OAuth 2.0 client) used by Google Sign-In on mobile.
   * Put your real value in api.config.local.js before using Google login.
   */
  GOOGLE_WEB_CLIENT_ID: '',
};

let local = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  local = require('./api.config.local.js');
} catch {
  // optional override file
}

export default { ...defaults, ...local };
