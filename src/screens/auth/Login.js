import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { userLogin } from '../../app/actions';
import { ROUTES, COLORS } from '../../utils';

const Login = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(s => s.auth);
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!emailAdd || !password) {
      Alert.alert('Incorrect Credentials', 'Please fill in all fields');
      return;
    }
    console.log('[Login] dispatch userLogin', { email: emailAdd });
    dispatch(userLogin({ email: emailAdd, password }));
  };

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
          color: COLORS.textDark,
          fontSize: 24,
          fontWeight: '800',
          marginBottom: 4,
        }}
      >
        Welcom to CLOUDROBE!
      </Text>
      <Text
        style={{
          color: COLORS.secondary,
          marginBottom: 16,
        }}
      >
        Find your cosplay inspiration and embrace your creativity!
      </Text>

      {error && (
        <Text
          style={{
            color: COLORS.error,
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          {error}
        </Text>
      )}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <CustomTextInput
          label={'Email Address'}
          placeholder={'Enter your email'}
          value={val => setEmailAdd(val)}
          containerStyle={{
            width: '100%',
            marginBottom: 16,
          }}
          labelStyle={{
            fontSize: 15,
            fontWeight: '500',
            color: COLORS.textDark,
          }}
          textStyle={{
            fontSize: 15,
            borderRadius: 10,
            color: COLORS.textDark,
            borderColor: COLORS.secondary,
          }}
        />

        <CustomTextInput
          label={'Password'}
          placeholder={'Enter your password'}
          value={val => setPassword(val)}
          containerStyle={{
            width: '100%',
          }}
          labelStyle={{
            fontSize: 15,
            fontWeight: '500',
            color: COLORS.textDark,
          }}
          textStyle={{
            fontSize: 15,
            borderRadius: 10,
            color: COLORS.textDark,
            borderColor: COLORS.secondary,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <CustomButton
          label={isLoading ? 'Signing in...' : 'Sign In'}
          containerStyle={{
            margin: 20,
            width: '60%',
            backgroundColor: COLORS.primary,
            borderRadius: 20,
          }}
          textStyle={{
            color: COLORS.textLight,
            textAlign: 'center',
            fontWeight: '800',
            fontSize: 18,
          }}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ color: COLORS.textDark }}>Already have an account?</Text>
        <TouchableOpacity
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
        >
          <Text
            style={{
              color: COLORS.link,
              fontWeight: '500',
            }}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: COLORS.textDark,
          fontWeight: '500',
          margin: 10,
        }}
      >
        
      </Text>


    </View>
  );
};

export default Login;