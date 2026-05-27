import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from '../components/ScreenLayout';
import EmptyState from '../components/EmptyState';
import { cartClear, cartRemove, cartUpdateQty } from '../app/actions/cart';
import { placeOrder } from '../app/api/orders';
import { COLORS, ROUTES, SPACING } from '../utils';

const MyCartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const items = useSelector(s => s.cart?.items || []);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('cash');
  const [checkingOut, setCheckingOut] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const checkout = async () => {
    if (items.length === 0) return;
    if (!address.trim()) {
      Alert.alert('Shipping required', 'Please enter your shipping address.');
      return;
    }
    setCheckingOut(true);
    try {
      const res = await placeOrder({
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          name: i.name,
          price: i.price,
        })),
        shippingAddress: address.trim(),
        customerPhone: phone.trim(),
        paymentMethod: payment,
      });
      dispatch(cartClear());
      Alert.alert(
        'Order placed',
        `Order ${res.data.transactionId} created. Staff will process it shortly.`,
        [{ text: 'View orders', onPress: () => navigation.navigate(ROUTES.MY_ORDER) }],
      );
    } catch (e) {
      Alert.alert('Checkout failed', e.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <ScreenLayout title="My Cart" subtitle="Review items and place your order">
      {items.length === 0 ? (
        <EmptyState
          title="Cart is empty"
          message="Browse collections and add products to your cart."
        />
      ) : (
        <>
          {items.map(item => (
            <View key={item.productId} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₱{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(cartUpdateQty(item.productId, item.quantity - 1))
                  }
                >
                  <Text style={styles.qtyBtn}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(cartUpdateQty(item.productId, item.quantity + 1))
                  }
                >
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => dispatch(cartRemove(item.productId))}>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={styles.total}>Total: ₱{total.toFixed(2)}</Text>

          <Text style={styles.label}>Shipping address *</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="Full delivery address"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
          <Text style={styles.label}>Payment</Text>
          <View style={styles.payRow}>
            {['cash', 'gcash', 'card'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.payChip, payment === m && styles.payChipActive]}
                onPress={() => setPayment(m)}
              >
                <Text style={[styles.payText, payment === m && styles.payTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.checkout}
            onPress={checkout}
            disabled={checkingOut}
          >
            <Text style={styles.checkoutText}>
              {checkingOut ? 'Placing order...' : 'Place Order'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { fontWeight: '700', color: COLORS.textDark },
  price: { color: COLORS.primary, fontWeight: '700', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.sm },
  qtyBtn: { fontSize: 20, fontWeight: '700', color: COLORS.primary, paddingHorizontal: 8 },
  qty: { fontWeight: '700', minWidth: 24, textAlign: 'center' },
  remove: { color: COLORS.error, fontSize: 18, padding: 8 },
  total: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginVertical: SPACING.md },
  label: { fontWeight: '600', color: COLORS.textDark, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    color: COLORS.textDark,
  },
  payRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  payChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  payChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  payText: { textTransform: 'capitalize', color: COLORS.textDark, fontWeight: '600' },
  payTextActive: { color: COLORS.textLight },
  checkout: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, alignItems: 'center' },
  checkoutText: { color: COLORS.textLight, fontWeight: '800', fontSize: 17 },
});

export default MyCartScreen;
