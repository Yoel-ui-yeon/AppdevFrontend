export const CART_ADD = 'CART_ADD';
export const CART_REMOVE = 'CART_REMOVE';
export const CART_UPDATE_QTY = 'CART_UPDATE_QTY';
export const CART_CLEAR = 'CART_CLEAR';

export const cartAdd = product => ({ type: CART_ADD, payload: product });
export const cartRemove = productId => ({ type: CART_REMOVE, payload: productId });
export const cartUpdateQty = (productId, quantity) => ({
  type: CART_UPDATE_QTY,
  payload: { productId, quantity },
});
export const cartClear = () => ({ type: CART_CLEAR });
