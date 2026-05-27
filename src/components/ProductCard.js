import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useResponsive from '../hooks/useResponsive';
import { COLORS, SPACING } from '../utils';

const ProductCard = ({ product, onPress, onAddToCart }) => {
  const { isDesktop, isWide } = useResponsive();
  const cardBasis = isDesktop ? '31%' : isWide ? '48%' : '48%';

  return (
  <TouchableOpacity style={[styles.card, { flexBasis: cardBasis, maxWidth: cardBasis }]} onPress={onPress} activeOpacity={0.85}>
    {product.image ? (
      <Image source={{ uri: product.image }} style={styles.image} />
    ) : (
      <View style={[styles.image, styles.placeholder]}>
        <Text style={styles.placeholderText}>CLOUDROBE</Text>
      </View>
    )}
    <View style={styles.body}>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      {product.category?.name ? (
        <Text style={styles.category}>{product.category.name}</Text>
      ) : null}
      <View style={styles.row}>
        <Text style={styles.price}>₱{parseFloat(product.price).toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onAddToCart?.(product)}
        >
          <Text style={styles.addBtnText}>+ Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    marginHorizontal: SPACING.xs,
    minWidth: '46%',
    maxWidth: '48%',
  },
  image: { width: '100%', height: 120 },
  placeholder: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },
  body: { padding: SPACING.sm },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  category: { fontSize: 11, color: COLORS.secondary, marginTop: 2 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  price: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnText: { color: COLORS.textLight, fontSize: 11, fontWeight: '700' },
});

export default ProductCard;
