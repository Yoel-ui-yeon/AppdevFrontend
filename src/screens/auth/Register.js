import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import useResponsive from '../../hooks/useResponsive';
import { registerUser } from '../../app/api/user';
import { COLORS, IMG, ROUTES, SPACING } from '../../utils';

const Register = () => {
  const navigation = useNavigation();
  const { formMaxWidth, contentMaxWidth } = useResponsive();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !fullName || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ email, username, fullName, password });
      Alert.alert('Account created', res.data?.message || 'Please verify your email, then sign in.', [
        { text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN) },
      ]);
    } catch (e) {
      Alert.alert('Registration failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.formWrap, { maxWidth: formMaxWidth }]}>
          <Image source={IMG.SECONDARY_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Join CLOUDROBE</Text>
          <Text style={styles.sub}>Create an account to order and submit custom cosplay requests.</Text>

          <CustomTextInput label="Full name" placeholder="Your name" onChangeText={setFullName} containerStyle={styles.field} labelStyle={styles.label} textStyle={styles.input} />
          <CustomTextInput label="Username" placeholder="username" onChangeText={setUsername} containerStyle={styles.field} labelStyle={styles.label} textStyle={styles.input} />
          <CustomTextInput label="Email" placeholder="you@email.com" onChangeText={setEmail} keyboardType="email-address" containerStyle={styles.field} labelStyle={styles.label} textStyle={styles.input} />
          <CustomTextInput label="Password" placeholder="Password" onChangeText={setPassword} secureTextEntry containerStyle={styles.field} labelStyle={styles.label} textStyle={styles.input} />

          <CustomButton
            label={loading ? 'Creating...' : 'Create Account'}
            containerStyle={styles.btnWrap}
            textStyle={styles.btnText}
            onPress={handleRegister}
          />

          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.lightBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xl, alignItems: 'center' },
  formWrap: { width: '100%' },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: SPACING.md },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, textAlign: 'center' },
  sub: { fontSize: 14, color: COLORS.textDark, textAlign: 'center', marginBottom: SPACING.lg, opacity: 0.9 },
  field: { width: '100%', marginBottom: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 4 },
  input: {
    fontSize: 15,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
  },
  btnWrap: { backgroundColor: COLORS.primary, borderRadius: 24, marginTop: SPACING.sm, width: '100%' },
  btnText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '800', fontSize: 17 },
  back: { marginTop: SPACING.lg, alignItems: 'center' },
  link: { color: COLORS.link, fontWeight: '700' },
});

export default Register;
