import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../utils';

const STATUS_COLORS = {
  new_order: COLORS.link,
  preparing: '#f9a825',
  ready_to_ship: '#1976d2',
  shipping: '#7b1fa2',
  delivered: COLORS.success,
  new_request: COLORS.link,
  quote_sent: '#1976d2',
  awaiting_approval: '#f9a825',
  approved: COLORS.success,
  rejected: COLORS.error,
  converted_to_order: COLORS.success,
};

const StatusBadge = ({ label, status }) => (
  <View style={[styles.badge, { backgroundColor: (STATUS_COLORS[status] || COLORS.secondary) + '33' }]}>
    <Text style={[styles.text, { color: STATUS_COLORS[status] || COLORS.textDark }]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: { fontSize: 12, fontWeight: '700' },
});

export default StatusBadge;
