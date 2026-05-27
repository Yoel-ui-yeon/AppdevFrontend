import { API_BASE_URL } from '../../utils/api';
import { getAuthHeaders } from './auth';

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(auth ? await getAuthHeaders() : {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error('Cannot connect to backend server');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid server response');
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || 'Request failed');
  }

  return data;
}
