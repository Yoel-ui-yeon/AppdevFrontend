/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (__DEV__) {
    console.log('[FCM] background:', remoteMessage);
  }
});
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
