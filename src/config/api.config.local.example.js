/**
 * Copy this file to api.config.local.js (same folder) and edit.
 * api.config.local.js is gitignored.
 */

// --- Option A: deployed Railway (same as defaults; only if you override domain) ---
// module.exports = {
//   RAILWAY_API_BASE: 'https://YOUR-APP.up.railway.app/api',
//   USE_RAILWAY_BACKEND: true,
//   GOOGLE_WEB_CLIENT_ID: '1234567890-xxxxx.apps.googleusercontent.com',
//   AUTO_REFRESH_MS: 15000,
// };

// --- Option B: local Symfony before deploy ---
// Terminal: cd AppdevBackend && php -S 127.0.0.1:8000 -t public
//
// iOS Simulator:
// module.exports = {
//   USE_RAILWAY_BACKEND: false,
//   LOCAL_API_BASE: 'http://127.0.0.1:8000/api',
//   AUTO_REFRESH_MS: 15000,
// };
//
// Android emulator (127.0.0.1 is the emulator itself, not your Mac):
// module.exports = {
//   USE_RAILWAY_BACKEND: false,
//   LOCAL_API_BASE: 'http://10.0.2.2:8000/api',
//   AUTO_REFRESH_MS: 15000,
// };

module.exports = {};
