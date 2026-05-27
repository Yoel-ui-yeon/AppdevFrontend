import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  return true;
}

export async function setupPushNotifications() {
  const allowed = await requestNotificationPermission();
  if (!allowed) {
    return null;
  }

  const token = await messaging().getToken();
  if (__DEV__) {
    console.log('[FCM] device token:', token);
  }

  messaging().onMessage(async remoteMessage => {
    if (__DEV__) {
      console.log('[FCM] foreground:', remoteMessage);
    }
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (__DEV__) {
      console.log('[FCM] opened from background:', remoteMessage);
    }
  });

  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification && __DEV__) {
    console.log('[FCM] opened from quit:', initialNotification);
  }

  return token;
}
