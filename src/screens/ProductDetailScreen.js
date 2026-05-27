import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProduct } from '../app/api/catalog';
import { cartAdd } from '../app/actions/cart';
import { COLORS, ROUTES, SPACING } from '../utils';

const ProductDetailScreen = ({ route, navigation }) => {
  const initial = route.params?.product;
  const productId = initial?.id ?? route.params?.productId;
  const [product, setProduct] = useState(initial ?? null);
  const [loading, setLoading] = useState(!initial?.id);
  const dispatch = useDispatch();

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetchProduct(productId);
      setProduct(res.data);
    } catch (e) {
      if (!product) {
        Alert.alert('Error', e.message || 'Could not load product');
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  }, [productId, navigation, product]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const price = parseFloat(product.price);
  const inStock = (product.stock ?? 0) > 0;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>CLOUDROBE</Text>
        </View>
      )}
      <Text style={styles.name}>{product.name}</Text>
      {product.category?.name ? (
        <Text style={styles.cat}>{product.category.name}</Text>
      ) : null}
      <Text style={styles.price}>₱{Number.isFinite(price) ? price.toFixed(2) : product.price}</Text>
      <Text style={styles.stock}>
        {inStock ? `In stock: ${product.stock}` : 'Out of stock'}
      </Text>
      <Text style={styles.desc}>{product.description || 'No description.'}</Text>

      <TouchableOpacity
        style={[styles.btn, !inStock && styles.btnDisabled]}
        disabled={!inStock}
        onPress={() => {
          dispatch(
            cartAdd({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
            }),
          );
          navigation.navigate(ROUTES.TABS, { screen: ROUTES.MY_CART });
        }}
      >
        <Text style={styles.btnText}>{inStock ? 'Add to cart' : 'Out of stock'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.lightBg },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  errorText: { color: COLORS.error, fontWeight: '600' },
  image: { width: '100%', height: 220, borderRadius: 16, marginBottom: SPACING.md },
  placeholder: { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.primary, fontWeight: '800' },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.textDark },
  cat: { color: COLORS.secondary, fontWeight: '600', marginTop: 4 },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginTop: SPACING.md },
  stock: { fontSize: 13, color: COLORS.textDark, marginTop: SPACING.xs },
  desc: { fontSize: 15, color: COLORS.textDark, lineHeight: 22, marginTop: SPACING.md },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: COLORS.textLight, fontWeight: '800', fontSize: 17 },
});

export default ProductDetailScreen;
