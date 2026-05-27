import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../utils';

const EmptyState = ({ title, message }) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  message: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.8,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default EmptyState;
