// API Configuration - Environment aware
const getApiBaseUrl = () => {
  // Check if running in Docker container
  if (window.location.hostname === 'localhost' && window.location.port === '80') {
    return 'http://localhost:8080'; // Docker backend
  }
  
  // Check if running in development
  if (window.location.hostname === 'localhost' && (window.location.port === '5173' || window.location.port === '3000')) {
    return 'http://localhost:8080'; // Local development
  }
  
  // Production - use relative URLs
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  USERS: `${API_BASE_URL}/api/users`,
  CART: `${API_BASE_URL}/api/cart`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  CATEGORIES: `${API_BASE_URL}/api/public/categories`,
  AUTH: `${API_BASE_URL}/api/users`,
};

export default API_ENDPOINTS;
