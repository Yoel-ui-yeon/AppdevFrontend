import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import StatusBadge from '../components/StatusBadge';
import { fetchCustomRequest } from '../app/api/customRequests';
import useAutoRefresh from '../hooks/useAutoRefresh';
import { COLORS, SPACING } from '../utils';

const CustomRequestDetailScreen = () => {
  const route = useRoute();
  const requestId = route.params?.request?.id ?? route.params?.requestId;
  const [request, setRequest] = useState(route.params?.request ?? null);
  const [loading, setLoading] = useState(!route.params?.request);

  const load = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const res = await fetchCustomRequest(requestId);
      setRequest(res.data);
    } catch {
      // keep last known data
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useAutoRefresh(load);

  if (!request && loading) {
    return (
      <View style={styles.root}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.root}>
        <Text style={styles.wait}>Could not load this request.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{request.cosplayCharacter}</Text>
      <StatusBadge label={request.statusLabel} status={request.status} />

      {request.estimatedCost ? (
        <Text style={styles.quote}>
          Estimated: ₱{parseFloat(request.estimatedCost).toFixed(2)}
        </Text>
      ) : null}

      {request.designNotes ? (
        <Text style={styles.notes}>{request.designNotes}</Text>
      ) : null}

      {request.status === 'rejected' ? (
        <View style={styles.rejectedBox}>
          <Text style={styles.rejectedText}>
            This request was rejected. Contact Cloudrobe if you have questions.
          </Text>
        </View>
      ) : request.canTrackProgress && request.progressSteps ? (
        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>Progress</Text>
          {request.progressSteps.map((step, i) => (
            <View key={step.key + i} style={styles.step}>
              <View
                style={[
                  styles.dot,
                  step.current && styles.dotCurrent,
                  step.completed && styles.dotDone,
                ]}
              />
              <Text style={[styles.stepLabel, step.current && styles.stepCurrent]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.wait}>
          Your request is queued. Staff will review and update the status here.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.lightBg, padding: SPACING.lg },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: SPACING.sm },
  quote: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.md },
  notes: { fontSize: 14, color: COLORS.textDark, marginTop: SPACING.md, lineHeight: 20 },
  rejectedBox: { backgroundColor: '#ffebee', padding: SPACING.md, borderRadius: 12, marginTop: SPACING.lg },
  rejectedText: { color: COLORS.error, fontWeight: '600' },
  timeline: { marginTop: SPACING.xl },
  timelineTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: SPACING.md },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  dotCurrent: { backgroundColor: COLORS.primary, width: 18, height: 18, borderRadius: 9 },
  dotDone: { backgroundColor: COLORS.success },
  stepLabel: { fontSize: 15, color: COLORS.textDark },
  stepCurrent: { fontWeight: '800', color: COLORS.primary },
  wait: { marginTop: SPACING.lg, fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
});

export default CustomRequestDetailScreen;
