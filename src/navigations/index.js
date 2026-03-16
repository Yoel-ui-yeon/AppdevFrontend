import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import AuthNav from './AuthNav';
import MainNav from './MainNav';
import { COLORS } from '../utils';

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const isLoggedIn = useSelector(s => Boolean(s?.auth?.token));

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(COLORS.background, true);
    }

    StatusBar.setBarStyle('dark-content', true);
  }, [isDarkMode]);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNav /> : <AuthNav />}
    </NavigationContainer>
  );
};
