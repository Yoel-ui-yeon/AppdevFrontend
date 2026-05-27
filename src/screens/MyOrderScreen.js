import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { fetchMyOrders } from '../app/api/orders';
import useAutoRefresh from '../hooks/useAutoRefresh';
import { COLORS, SPACING } from '../utils';

const ORDER_STEPS = ['new_order', 'preparing', 'ready_to_ship', 'shipping', 'delivered'];

const MyOrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async (isPull = false) => {
    if (!isPull) setLoading(true);
    try {
      const res = await fetchMyOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(load);

  return (
    <ScreenLayout
      title="My Orders"
      subtitle="Staff status updates sync automatically"
      refreshing={loading}
      onRefresh={() => load(true)}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Place an order from your cart to see it here."
        />
      ) : (
        orders.map(o => (
          <TouchableOpacity
            key={o.transactionId}
            style={styles.card}
            onPress={() => setExpanded(expanded === o.transactionId ? null : o.transactionId)}
          >
            <View style={styles.cardHead}>
              <Text style={styles.id}>{o.transactionId}</Text>
              <StatusBadge label={o.statusLabel} status={o.status} />
            </View>
            <Text style={styles.amount}>₱{parseFloat(o.totalAmount).toFixed(2)}</Text>
            <Text style={styles.items} numberOfLines={expanded === o.transactionId ? 10 : 2}>
              {o.itemsDescription}
            </Text>

            {expanded === o.transactionId && (
              <View style={styles.timeline}>
                {ORDER_STEPS.map(step => {
                  const idx = ORDER_STEPS.indexOf(o.status);
                  const stepIdx = ORDER_STEPS.indexOf(step);
                  const done = stepIdx <= idx;
                  const current = step === o.status;
                  return (
                    <View key={step} style={styles.step}>
                      <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]} />
                      <Text style={[styles.stepText, current && styles.stepCurrent]}>
                        {step.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  );
                })}
                {o.trackingNumber ? (
                  <Text style={styles.track}>
                    {o.shippingCarrier}: {o.trackingNumber}
                  </Text>
                ) : null}
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontWeight: '800', color: COLORS.textDark, fontSize: 14 },
  amount: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginTop: SPACING.sm },
  items: { fontSize: 13, color: COLORS.textDark, marginTop: SPACING.xs, opacity: 0.9 },
  timeline: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.border, marginRight: 10 },
  dotDone: { backgroundColor: COLORS.success },
  dotCurrent: { backgroundColor: COLORS.primary, width: 14, height: 14, borderRadius: 7 },
  stepText: { fontSize: 13, color: COLORS.textDark, textTransform: 'capitalize' },
  stepCurrent: { fontWeight: '800', color: COLORS.primary },
  track: { marginTop: SPACING.sm, fontSize: 13, fontWeight: '600', color: COLORS.textDark },
});

export default MyOrderScreen;
