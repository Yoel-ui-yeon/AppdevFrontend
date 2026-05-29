import apiConfig from '../config/api.config';

const BASE_RECONNECT_MS = 1000;
const MAX_RECONNECT_MS = 12000;

let ws = null;
let reconnectTimer = null;
let reconnectMs = BASE_RECONNECT_MS;
let listeners = new Set();
let connectAttempt = 0;

function getWsUrl() {
  return String(apiConfig.WS_URL || '').trim();
}

function dispatchEvent(event) {
  if (!event?.type || event.type === 'hello') {
    return;
  }
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      // listener errors must not break the socket loop
    }
  });
}

function scheduleReconnect() {
  if (!listeners.size || reconnectTimer) {
    return;
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, reconnectMs);
  reconnectMs = Math.min(MAX_RECONNECT_MS, reconnectMs * 2);
}

function connect() {
  const url = getWsUrl();
  if (!url || !listeners.size) {
    return;
  }
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  connectAttempt += 1;
  try {
    ws = new WebSocket(url);
  } catch (error) {
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    reconnectMs = BASE_RECONNECT_MS;
  };

  ws.onmessage = message => {
    try {
      const event = JSON.parse(message?.data || '{}');
      dispatchEvent(event);
    } catch (error) {
      // ignore malformed payloads
    }
  };

  ws.onerror = () => {
    // onclose handles reconnect
  };

  ws.onclose = () => {
    ws = null;
    scheduleReconnect();
  };
}

function ensureConnected() {
  if (!getWsUrl()) {
    return;
  }
  connect();
}

/**
 * Subscribe to realtime events from the shared WebSocket connection.
 * Returns an unsubscribe function.
 */
export function subscribeRealtimeEvents(listener) {
  if (typeof listener !== 'function') {
    return () => {};
  }
  listeners.add(listener);
  ensureConnected();

  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (ws) {
        ws.close();
        ws = null;
      }
    }
  };
}

export function isRealtimeSocketConfigured() {
  return getWsUrl() !== '';
}

export default subscribeRealtimeEvents;
