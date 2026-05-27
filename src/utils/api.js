import apiConfig from '../config/api.config';

/** Local Symfony: php -S 127.0.0.1:8000 -t public (in cloudrobe) */
const LOCAL_API = 'http://127.0.0.1:8000/api';

/**
 * Android emulator → host machine (when using local backend only):
 * const LOCAL_API = 'http://10.0.2.2:8000/api';
 */

export const API_BASE_URL = apiConfig.USE_RAILWAY_BACKEND
  ? apiConfig.RAILWAY_API_BASE
  : LOCAL_API;

export const AUTO_REFRESH_MS = apiConfig.AUTO_REFRESH_MS ?? 15000;

export const IS_RAILWAY_BACKEND = apiConfig.USE_RAILWAY_BACKEND;

export default API_BASE_URL;
