import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import ScreenLayout from '../components/ScreenLayout';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import {
  fetchMyCustomRequests,
  submitCustomRequest,
} from '../app/api/customRequests';
import useAutoRefresh from '../hooks/useAutoRefresh';
import { COLORS, ROUTES, SPACING } from '../utils';

const CustomRequestScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('list');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [character, setCharacter] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [height, setHeight] = useState('');

  const load = useCallback(async (isPull = false) => {
    if (!isPull) setLoading(true);
    try {
      const res = await fetchMyCustomRequests();
      setRequests(res.data || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(load);

  const handleSubmit = async () => {
    if (!character.trim()) {
      Alert.alert('Required', 'Please enter the cosplay character name.');
      return;
    }
    setSubmitting(true);
    try {
      await submitCustomRequest({
        cosplayCharacter: character.trim(),
        designNotes: notes.trim() || null,
        customerPhone: phone.trim() || null,
        bust: bust || null,
        waist: waist || null,
        hip: hip || null,
        height: height || null,
      });
      Alert.alert('Submitted', 'Your custom request was sent. Staff will review it soon.');
      setCharacter('');
      setNotes('');
      setPhone('');
      setBust('');
      setWaist('');
      setHip('');
      setHeight('');
      setTab('list');
      load();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Custom Cosplay"
      subtitle="Staff review and quotes sync from the dashboard"
      refreshing={loading && tab === 'list'}
      onRefresh={tab === 'list' ? () => load(true) : undefined}
    >
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'list' && styles.tabActive]}
          onPress={() => setTab('list')}
        >
          <Text style={[styles.tabText, tab === 'list' && styles.tabTextActive]}>My Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'new' && styles.tabActive]}
          onPress={() => setTab('new')}
        >
          <Text style={[styles.tabText, tab === 'new' && styles.tabTextActive]}>New Request</Text>
        </TouchableOpacity>
      </View>

      {tab === 'new' ? (
        <View style={styles.form}>
          <Text style={styles.label}>Character / Cosplay *</Text>
          <TextInput style={styles.input} value={character} onChangeText={setCharacter} placeholder="e.g. Sailor Moon" placeholderTextColor="#999" />
          <Text style={styles.label}>Design notes</Text>
          <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Fabrics, colors, accessories..." placeholderTextColor="#999" />
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Text style={styles.section}>Measurements (cm)</Text>
          <View style={styles.row}>
            <View style={styles.half}><Text style={styles.label}>Bust</Text><TextInput style={styles.input} value={bust} onChangeText={setBust} keyboardType="decimal-pad" /></View>
            <View style={styles.half}><Text style={styles.label}>Waist</Text><TextInput style={styles.input} value={waist} onChangeText={setWaist} keyboardType="decimal-pad" /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.half}><Text style={styles.label}>Hip</Text><TextInput style={styles.input} value={hip} onChangeText={setHip} keyboardType="decimal-pad" /></View>
            <View style={styles.half}><Text style={styles.label}>Height</Text><TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="decimal-pad" /></View>
          </View>
          <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests yet" message="Submit a custom cosplay request for staff review." />
      ) : (
        requests.map(r => (
          <TouchableOpacity
            key={r.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate(ROUTES.CUSTOM_REQUEST_DETAIL, { request: r })
            }
          >
            <Text style={styles.cardTitle}>{r.cosplayCharacter}</Text>
            <StatusBadge label={r.statusLabel} status={r.status} />
            <Text style={styles.cardMeta}>
              {r.status === 'rejected'
                ? 'This request was rejected by staff.'
                : r.canTrackProgress
                  ? 'Tap to view progress'
                  : 'Waiting for staff review'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginBottom: SPACING.lg, gap: SPACING.sm },
  tab: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: COLORS.card, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontWeight: '700', color: COLORS.textDark },
  tabTextActive: { color: COLORS.textLight },
  form: { backgroundColor: COLORS.card, padding: SPACING.md, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  label: { fontWeight: '600', color: COLORS.textDark, marginBottom: 4, marginTop: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, color: COLORS.textDark, backgroundColor: COLORS.lightBg },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  section: { fontWeight: '800', color: COLORS.primary, marginTop: SPACING.md },
  row: { flexDirection: 'row', gap: SPACING.sm },
  half: { flex: 1 },
  submit: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, marginTop: SPACING.lg, alignItems: 'center' },
  submitText: { color: COLORS.textLight, fontWeight: '800' },
  card: { backgroundColor: COLORS.card, padding: SPACING.md, borderRadius: 16, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  cardMeta: { fontSize: 13, color: COLORS.textDark, opacity: 0.8, marginTop: SPACING.sm },
});

export default CustomRequestScreen;
