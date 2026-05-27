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
    throw new Error(
      `Cannot connect to backend server (${API_BASE_URL}). Check Wi‑Fi, VPN, and api.config — on a physical phone use your Mac’s LAN IP for local dev (not 10.0.2.2).`,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid server response');
  }

  if (!response.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      data?.detail ||
      data?.title ||
      (typeof data === 'string' ? data : null) ||
      'Request failed';
    throw new Error(String(msg));
  }

  return data;
}
