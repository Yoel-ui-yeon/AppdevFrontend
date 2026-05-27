import { apiRequest } from './client';

export const fetchMyOrders = () => apiRequest('/v1/orders', { auth: true });
export const fetchOrder = transactionId =>
  apiRequest(`/v1/orders/${transactionId}`, { auth: true });
export const placeOrder = payload =>
  apiRequest('/v1/orders', { method: 'POST', body: payload, auth: true });
