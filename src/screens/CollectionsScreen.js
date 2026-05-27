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
import { fetchCategories, fetchProducts } from '../app/api/catalog';
import { cartAdd } from '../app/actions/cart';
import useAutoRefresh from '../hooks/useAutoRefresh';
import { COLORS, ROUTES, SPACING } from '../utils';

const CollectionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterId, setFilterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (isPull = false) => {
    if (!isPull) setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (e) {
      setCategories([]);
      setProducts([]);
      setError(e.message || 'Could not load catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(load);

  const filtered = filterId
    ? products.filter(p => p.category?.id === filterId)
    : products;

  return (
    <ScreenLayout
      title="Collections"
      subtitle="Live catalog from Cloudrobe"
      refreshing={loading}
      onRefresh={() => load(true)}
    >
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.chip, !filterId && styles.chipActive]}
          onPress={() => setFilterId(null)}
        >
          <Text style={[styles.chipText, !filterId && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, filterId === c.id && styles.chipActive]}
            onPress={() => setFilterId(c.id)}
          >
            <Text style={[styles.chipText, filterId === c.id && styles.chipTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : error ? (
        <EmptyState title="Could not load catalog" message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" message="Try another category or reload fixtures on the server." />
      ) : (
        <View style={styles.grid}>
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: p })}
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
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textDark, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: COLORS.textLight },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default CollectionsScreen;
