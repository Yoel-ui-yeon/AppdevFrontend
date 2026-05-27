import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenLayout from '../components/ScreenLayout';
import { authLogout } from '../app/api/auth';
import { fetchMe } from '../app/api/user';
import { userLoginReset } from '../app/actions';
import { COLORS, SPACING } from '../utils';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(s => s.auth?.user);
  const [profile, setProfile] = useState(authUser);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMe();
      setProfile(res.data);
    } catch {
      setProfile(authUser);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const logout = async () => {
    await authLogout();
    dispatch(userLoginReset());
  };

  return (
    <ScreenLayout title="Profile" subtitle="Your Cloudrobe account">
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.name}>{profile?.fullName || '—'}</Text>
          <Text style={styles.row}>@{profile?.username}</Text>
          <Text style={styles.row}>{profile?.email}</Text>
          <Text style={styles.badge}>
            {profile?.verified ? '✓ Email verified' : 'Email not verified'}
          </Text>
        </View>
      )}

      <Text style={styles.hint}>
        Orders and custom requests sync with the admin dashboard in real time when you refresh each tab.
      </Text>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  row: { fontSize: 15, color: COLORS.textDark, marginTop: SPACING.sm, opacity: 0.9 },
  badge: { marginTop: SPACING.md, color: COLORS.primary, fontWeight: '700' },
  hint: { fontSize: 13, color: COLORS.textDark, lineHeight: 20, opacity: 0.85, marginBottom: SPACING.xl },
  logout: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.textDark, fontWeight: '800' },
});

export default ProfileScreen;
