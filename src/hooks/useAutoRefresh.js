import { useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AUTO_REFRESH_MS } from '../utils/api';

/**
 * Load on screen focus, pull-to-refresh, and every AUTO_REFRESH_MS while focused.
 * Keeps mobile in sync with admin/staff changes on the Railway dashboard.
 */
export function useAutoRefresh(load, intervalMs = AUTO_REFRESH_MS) {
  const appState = useRef(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      load();
      const timer = setInterval(load, intervalMs);
      const subscription = AppState.addEventListener('change', nextState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          load();
        }
        appState.current = nextState;
      });
      return () => {
        clearInterval(timer);
        subscription.remove();
      };
    }, [load, intervalMs]),
  );
}

export default useAutoRefresh;
