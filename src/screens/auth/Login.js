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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import useResponsive from '../../hooks/useResponsive';
import { userLogin } from '../../app/actions';
import { COLORS, IMG, ROUTES, SPACING } from '../../utils';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(s => s.auth);
  const navigation = useNavigation();
  const { isWide, formMaxWidth, contentMaxWidth } = useResponsive();

  const handleLogin = () => {
    if (!username.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your username and password.');
      return;
    }
    dispatch(userLogin({ username: username.trim(), password }));
  };

  const handleGoogleLogin = () => {
    dispatch(userLogin({ provider: 'google' }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isWide && styles.scrollWide,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.inner, isWide && styles.innerWide]}>
          <View style={[styles.hero, isWide && styles.heroWide]}>
            <Image source={IMG.SECONDARY_LOGO} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>CLOUDROBE</Text>
            <Text style={styles.tagline}>Your cosplay in full color</Text>
          </View>

          <View style={[styles.card, { maxWidth: formMaxWidth }, isWide && styles.cardWide]}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSub}>
              Sign in with your username to shop, track orders, and request custom cosplays.
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <CustomTextInput
              label="Username"
              placeholder="e.g. customer or demo_customer"
              onChangeText={setUsername}
              containerStyle={styles.field}
              labelStyle={styles.label}
              textStyle={styles.input}
            />
            <CustomTextInput
              label="Password"
              placeholder="Enter your password"
              onChangeText={setPassword}
              secureTextEntry
              containerStyle={styles.field}
              labelStyle={styles.label}
              textStyle={styles.input}
            />

            <CustomButton
              label={isLoading ? 'Signing in...' : 'Sign In'}
              containerStyle={styles.btnWrap}
              textStyle={styles.btnText}
              onPress={handleLogin}
            />
            <CustomButton
              label={isLoading ? 'Please wait...' : 'Continue with Google'}
              containerStyle={styles.googleBtnWrap}
              textStyle={styles.googleBtnText}
              onPress={handleGoogleLogin}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>New to Cloudrobe?</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                <Text style={styles.link}>Create account</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>
              Test: customer / customer123{'\n'}or demo_customer / demo123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1 },
  scrollWide: { justifyContent: 'center', minHeight: '100%' },
  inner: { flex: 1 },
  innerWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: '100%',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.secondary,
    minHeight: 220,
  },
  heroWide: {
    flex: 1,
    minHeight: '100%',
  },
  logo: { width: 100, height: 100, marginBottom: SPACING.md },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: 2,
  },
  tagline: { fontSize: 14, color: COLORS.textLight, marginTop: SPACING.xs, opacity: 0.95 },
  card: {
    backgroundColor: COLORS.lightBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    width: '100%',
    alignSelf: 'center',
  },
  cardWide: {
    flex: 1,
    maxWidth: 480,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  cardSub: { fontSize: 14, color: COLORS.textDark, opacity: 0.85, marginBottom: SPACING.md },
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
  btnWrap: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    marginTop: SPACING.sm,
  },
  btnText: { color: COLORS.textLight, textAlign: 'center', fontWeight: '800', fontSize: 17 },
  googleBtnWrap: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  googleBtnText: { color: COLORS.textDark, textAlign: 'center', fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.lg, gap: 6, flexWrap: 'wrap' },
  footerText: { color: COLORS.textDark },
  link: { color: COLORS.link, fontWeight: '700' },
  error: { color: COLORS.error, marginBottom: SPACING.sm },
  hint: {
    marginTop: SPACING.md,
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default Login;
