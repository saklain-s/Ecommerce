package com.ecommerce.project.service;

import com.ecommerce.project.model.Cart;

public interface CartService {
    Cart getCartByUserId(Long userId);
    Cart addItemToCart(Long userId, Long productId, int quantity);
    Cart updateItemQuantity(Long userId, Long productId, int quantity);
    Cart removeItemFromCart(Long userId, Long productId);
    void clearCart(Long userId);
} 