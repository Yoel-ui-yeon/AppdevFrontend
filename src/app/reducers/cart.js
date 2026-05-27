import { CART_ADD, CART_CLEAR, CART_REMOVE, CART_UPDATE_QTY } from '../actions/cart';

const initialState = { items: [] };

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case CART_ADD: {
      const product = action.payload;
      const existing = state.items.find(i => i.productId === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1,
            stock: product.stock,
          },
        ],
      };
    }
    case CART_REMOVE:
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload),
      };
    case CART_UPDATE_QTY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i,
        ),
      };
    }
    case CART_CLEAR:
      return initialState;
    default:
      return state;
  }
}
