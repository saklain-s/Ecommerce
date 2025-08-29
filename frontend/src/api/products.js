import axios from 'axios';
import { API_ENDPOINTS } from './config.js';

export const fetchProducts = () => axios.get(API_ENDPOINTS.PRODUCTS);
export const fetchProductsByCategory = (category) => axios.get(`${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}`);
export const fetchProductById = (id) => axios.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
export const searchProducts = (query) => axios.get(`${API_ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`); 