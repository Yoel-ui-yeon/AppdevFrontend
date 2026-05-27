import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, ROUTES } from '../utils';
import HomeScreen from '../screens/HomeScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import CustomRequestScreen from '../screens/CustomRequestScreen';
import MyOrderScreen from '../screens/MyOrderScreen';
import MyCartScreen from '../screens/MyCartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabIcon = label => ({ color, size }) => (
  <Text style={{ fontSize: size - 4, color, fontWeight: '700' }}>{label}</Text>
);

const TabNav = () => {
  const cartCount = useSelector(s => s.cart?.items?.reduce((n, i) => n + i.quantity, 0) || 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDark,
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
          borderTopColor: COLORS.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ tabBarIcon: tabIcon('⌂'), title: 'Home' }}
      />
      <Tab.Screen
        name={ROUTES.COLLECTIONS}
        component={CollectionsScreen}
        options={{ tabBarIcon: tabIcon('☰'), title: 'Collections' }}
      />
      <Tab.Screen
        name={ROUTES.CUSTOM_REQUEST}
        component={CustomRequestScreen}
        options={{ tabBarIcon: tabIcon('✦'), title: 'Custom' }}
      />
      <Tab.Screen
        name={ROUTES.MY_ORDER}
        component={MyOrderScreen}
        options={{ tabBarIcon: tabIcon('📦'), title: 'Orders' }}
      />
      <Tab.Screen
        name={ROUTES.MY_CART}
        component={MyCartScreen}
        options={{
          tabBarIcon: tabIcon('🛒'),
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon('👤'), title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
