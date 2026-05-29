import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ScreenLayout from '../components/ScreenLayout';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { fetchProducts } from '../app/api/catalog';
import { cartAdd } from '../app/actions/cart';
import useAutoRefresh from '../hooks/useAutoRefresh';
import { subscribeCatalogRealtime } from '../services/catalogRealtime';
import { COLORS, ROUTES, SPACING } from '../utils';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (isPull = false) => {
    if (!isPull) setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts();
      setProducts((res.data || []).slice(0, 6));
    } catch (e) {
      setProducts([]);
      setError(e.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(load, {
    realtimeSubscribe: reload => subscribeCatalogRealtime(() => reload(true)),
  });

  return (
    <ScreenLayout
      showLogo
      title="Welcome to CLOUDROBE"
      subtitle="Synced with Cloudrobe staff dashboard"
      refreshing={loading}
      onRefresh={() => load(true)}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your cosplay in full color</Text>
        <Text style={styles.heroText}>
          Browse collections, customize cosplays, and track orders — all synced with our team.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate(ROUTES.COLLECTIONS)}
        >
          <Text style={styles.actionText}>Browse Collections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionAlt]}
          onPress={() => navigation.navigate(ROUTES.CUSTOM_REQUEST)}
        >
          <Text style={styles.actionText}>Custom Request</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Featured products</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
      ) : error ? (
        <EmptyState title="Could not load products" message={error} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          message="Run product fixtures on the server: php bin/console doctrine:fixtures:load -n"
        />
      ) : (
        <View style={styles.grid}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() =>
                navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: p })
              }
              onAddToCart={item =>
                dispatch(
                  cartAdd({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    stock: item.stock,
                  }),
                )
              }
            />
          ))}
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textLight },
  heroText: { fontSize: 14, color: COLORS.textLight, marginTop: SPACING.sm, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionAlt: { backgroundColor: COLORS.textDark },
  actionText: { color: COLORS.textLight, fontWeight: '700', fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default HomeScreen;
