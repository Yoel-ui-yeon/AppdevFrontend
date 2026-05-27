import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, ROUTES } from '../utils';
import TabNav from './TabNav';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CustomRequestDetailScreen from '../screens/CustomRequestDetailScreen';

const Stack = createStackNavigator();

const MainNav = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.secondary },
      headerTintColor: COLORS.textDark,
      headerTitleStyle: { fontWeight: '800' },
    }}
  >
    <Stack.Screen
      name={ROUTES.TABS}
      component={TabNav}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={ROUTES.PRODUCT_DETAIL}
      component={ProductDetailScreen}
      options={{ title: 'Product' }}
    />
    <Stack.Screen
      name={ROUTES.CUSTOM_REQUEST_DETAIL}
      component={CustomRequestDetailScreen}
      options={{ title: 'Request Progress' }}
    />
  </Stack.Navigator>
);

export default MainNav;
