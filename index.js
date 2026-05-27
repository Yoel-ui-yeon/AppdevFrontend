/**
 * @format
 */

import { AppRegistry } from 'react-native';

try {
  // Load lazily so startup does not crash on devices missing Google/Firebase setup.
  // eslint-disable-next-line global-require
  const messaging = require('@react-native-firebase/messaging').default;
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (__DEV__) {
      console.log('[FCM] background:', remoteMessage);
    }
  });
} catch (error) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('[FCM] background handler disabled:', error?.message);
  }
}
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
