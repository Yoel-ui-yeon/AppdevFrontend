import { apiRequest } from './client';

export const fetchMe = () => apiRequest('/v1/me', { auth: true });
export const registerUser = payload =>
  apiRequest('/v1/register', { method: 'POST', body: payload });
