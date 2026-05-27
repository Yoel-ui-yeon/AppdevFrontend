import { PermissionsAndroid, Platform } from 'react-native';

function getMessaging() {
  try {
    // eslint-disable-next-line global-require
    return require('@react-native-firebase/messaging').default;
  } catch {
    return null;
  }
}

async function requestNotificationPermission() {
  const messaging = getMessaging();
  if (!messaging) {
    return false;
  }

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
  const messaging = getMessaging();
  if (!messaging) {
    return null;
  }

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
