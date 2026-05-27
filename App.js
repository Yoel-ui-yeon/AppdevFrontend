import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppNavigationNi from './src/navigations';
import configureStore from './src/app/reducers';
import rootSaga from './src/app/sagas';
import { API_BASE_URL } from './src/utils/api';

const App = () => {
  const { store, persistor, runSaga } = React.useMemo(() => configureStore(), []);

  React.useEffect(() => {
    runSaga(rootSaga);
  }, [runSaga]);

  React.useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Cloudrobe] API_BASE_URL =', API_BASE_URL);
    }
  }, []);

  React.useEffect(() => {
    setupPushNotifications().catch(error => {
      if (__DEV__) {
        console.warn('[FCM] setup failed:', error);
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <AppNavigationNi />
        </View>
      </PersistGate>
    </Provider>
  );
};

export default App;
