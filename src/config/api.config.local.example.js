/**
 * Copy this file to api.config.local.js (same folder) and edit.
 * api.config.local.js is gitignored.
 *
 * Google Sign-In: after you fix Firebase and replace google-services.json, run
 *   npm run sync-google-web-client
 * Or set GOOGLE_WEB_CLIENT_ID here to your Web client (…apps.googleusercontent.com).
 * See docs/GOOGLE_SIGNIN_SETUP.md.
 */

// --- Option A: deployed Railway (same as defaults; only if you override domain) ---
// module.exports = {
//   RAILWAY_API_BASE: 'https://YOUR-APP.up.railway.app/api',
//   USE_RAILWAY_BACKEND: true,
//   GOOGLE_WEB_CLIENT_ID: '1234567890-xxxxx.apps.googleusercontent.com',
//   AUTO_REFRESH_MS: 15000,
//   WS_URL: 'wss://YOUR-WS.up.railway.app/ws',
// };

// --- Option B: local Symfony before deploy ---
// Terminal: cd AppdevBackend && php -S 127.0.0.1:8000 -t public
//
// iOS Simulator:
// module.exports = {
//   USE_RAILWAY_BACKEND: false,
//   LOCAL_API_BASE: 'http://127.0.0.1:8000/api',
//   AUTO_REFRESH_MS: 15000,
//   WS_URL: 'wss://YOUR-WS.up.railway.app/ws',
// };
//
// Android emulator (127.0.0.1 is the emulator itself, not your Mac):
// module.exports = {
//   USE_RAILWAY_BACKEND: false,
//   LOCAL_API_BASE: 'http://10.0.2.2:8000/api',
//   AUTO_REFRESH_MS: 15000,
//   WS_URL: 'wss://YOUR-WS.up.railway.app/ws',
// };

module.exports = {};
