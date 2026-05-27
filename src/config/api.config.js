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

  /** Refetch lists while a screen is open (admin/staff updates appear automatically) */
  AUTO_REFRESH_MS: 15000,
};

let local = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  local = require('./api.config.local.js');
} catch {
  // optional override file
}

export default { ...defaults, ...local };
