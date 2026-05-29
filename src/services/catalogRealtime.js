import { subscribeRealtimeEvents } from './realtimeSocket';

const CATALOG_EVENT_TYPES = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
]);

/**
 * Calls onChange when staff updates the product catalog.
 */
export function subscribeCatalogRealtime(onChange) {
  if (typeof onChange !== 'function') {
    return () => {};
  }

  return subscribeRealtimeEvents(event => {
    if (CATALOG_EVENT_TYPES.has(event?.type)) {
      onChange(event);
    }
  });
}

export default subscribeCatalogRealtime;
