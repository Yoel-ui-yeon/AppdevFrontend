import apiConfig from '../config/api.config';

/** Local Symfony: php -S 127.0.0.1:8000 -t public (from AppdevBackend) */
export const API_BASE_URL = apiConfig.USE_RAILWAY_BACKEND
  ? apiConfig.RAILWAY_API_BASE
  : (apiConfig.LOCAL_API_BASE || 'http://127.0.0.1:8000/api');

export const AUTO_REFRESH_MS = apiConfig.AUTO_REFRESH_MS ?? 15000;

export const IS_RAILWAY_BACKEND = apiConfig.USE_RAILWAY_BACKEND;

export default API_BASE_URL;
