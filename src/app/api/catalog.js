import { apiRequest } from './client';

export const fetchProducts = () => apiRequest('/v1/products');
export const fetchProduct = id => apiRequest(`/v1/products/${id}`);
export const fetchCategories = () => apiRequest('/v1/categories');
