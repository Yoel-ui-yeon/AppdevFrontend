import { Image, Text, TouchableOpacity, View } from 'react-native';
import { IMG, COLORS } from '../utils';
import { userLoginReset } from '../app/actions';
import { useDispatch } from 'react-redux';

const ProfileScreen = () => {
  const dispatch = useDispatch();
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
      <Image
        source={IMG.SECONDARY_LOGO}
        style={{
          width: 200,
          height: 200,
          marginBottom: 16,
        }}
      />
      <Text
        style={{
          color: COLORS.textDark,
          fontSize: 22,
          fontWeight: '700',
          marginBottom: 16,
        }}
      >
        Profile
      </Text>
      <TouchableOpacity onPress={() => dispatch(userLoginReset())}>
        <Text
          style={{
            color: COLORS.link,
            fontWeight: '600',
          }}
        >
          Log out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
