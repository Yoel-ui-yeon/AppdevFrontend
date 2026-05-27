import { apiRequest } from './client';

export const fetchMyCustomRequests = () =>
  apiRequest('/v1/custom-requests', { auth: true });
export const fetchCustomRequest = id =>
  apiRequest(`/v1/custom-requests/${id}`, { auth: true });
export const submitCustomRequest = payload =>
  apiRequest('/v1/custom-requests', {
    method: 'POST',
    body: payload,
    auth: true,
  });
