import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [], // { product, quantity }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.productId === action.product.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.productId === action.product.productId
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.product.productId !== action.productId),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.product.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Load cart from localStorage on initialization (only if authenticated)
  const loadCartFromStorage = () => {
    if (!isAuthenticated) {
      return initialState;
    }
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : initialState;
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Save cart to localStorage whenever it changes (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(state));
    } else {
      // Clear cart from localStorage when not authenticated
      localStorage.removeItem('cart');
    }
  }, [state, isAuthenticated]);

  const addToCart = (product, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to cart');
    }
    dispatch({ type: 'ADD_ITEM', product, quantity });
  };
  const removeFromCart = (productId) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify cart');
    }
    dispatch({ type: 'REMOVE_ITEM', productId });
  };
  const updateQuantity = (productId, quantity) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify cart');
    }
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };
  const clearCart = () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify cart');
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 