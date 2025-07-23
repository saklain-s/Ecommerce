package com.ecommerce.project.service;

import com.ecommerce.project.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long productId);
    List<Product> getProductsByCategory(Long categoryId);
    Product createProduct(Product product);
    Product updateProduct(Long productId, Product product);
    void deleteProduct(Long productId);
} 