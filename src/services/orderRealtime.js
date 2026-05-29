import { waitForOrderRealtimeEvent } from '../app/api/orders';
import { isRealtimeSocketConfigured, subscribeRealtimeEvents } from './realtimeSocket';

const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 12000;
const ORDER_EVENT_TYPES = new Set(['order.created', 'order.status.updated']);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * WebSocket-first realtime with HTTP long-poll fallback for order updates.
 */
export function startOrderRealtimeLoop({ onEvent, onError, initialCursor = 0 } = {}) {
  let active = true;
  let cursor = Number(initialCursor) || 0;
  let backoffMs = BASE_BACKOFF_MS;

  const unsubscribeWs = subscribeRealtimeEvents(event => {
    if (!active || !ORDER_EVENT_TYPES.has(event?.type)) {
      return;
    }
    const payload = event?.payload || {};
    cursor += 1;
    if (typeof onEvent === 'function') {
      onEvent({
        type: event.type,
        cursor,
        orderId: payload.orderId,
        transactionId: payload.transactionId,
        status: payload.status,
        statusLabel: payload.statusLabel,
        oldStatus: payload.oldStatus,
      });
    }
  });

  const runLongPoll = async () => {
    while (active) {
      try {
        const response = await waitForOrderRealtimeEvent(cursor);
        const event = response?.data || null;

        if (event?.cursor) {
          cursor = Number(event.cursor) || cursor;
          if (typeof onEvent === 'function') {
            await onEvent(event);
          }
        }

        backoffMs = BASE_BACKOFF_MS;
      } catch (error) {
        if (typeof onError === 'function') {
          onError(error);
        }
        await sleep(backoffMs);
        backoffMs = Math.min(MAX_BACKOFF_MS, backoffMs * 2);
      }
    }
  };

  if (!isRealtimeSocketConfigured()) {
    runLongPoll();
  } else {
    // Long-poll remains as a safety net when WebSocket misses an event.
    runLongPoll();
  }

  return () => {
    active = false;
    unsubscribeWs();
  };
}

export default startOrderRealtimeLoop;
