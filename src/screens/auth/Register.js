import { Text, TouchableOpacity, View } from 'react-native';
import { ROUTES, COLORS } from '../../utils';
import navigations from '../../navigations';

const Register = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: COLORS.textDark,
          marginBottom: 16,
        }}
      >
        Register
      </Text>

      <TouchableOpacity
        style={{ marginTop: 8 }}
        onPress={() => navigations.navigate(ROUTES.LOGIN)}
      >
        <Text
          style={{
            color: COLORS.link,
            fontWeight: '500',
          }}
        >
          Go back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
