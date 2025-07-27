package com.ecommerce.project.service;

import com.ecommerce.project.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Page<Product> getAllProducts(Pageable pageable);
    Product getProductById(Long productId);
    List<Product> getProductsByCategory(Long categoryId);
    List<Product> searchProducts(String searchTerm);
    List<Product> getProductsByPriceRange(double minPrice, double maxPrice);
    Product createProduct(Product product);
    Product updateProduct(Long productId, Product product);
    void deleteProduct(Long productId);
} 