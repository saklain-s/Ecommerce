package com.ecommerce.project.service;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired(required = false)
    private RedisService redisService;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Product getProductById(Long productId) {
        try {
            // Try to get from cache first
            Object cachedProduct = redisService.getCachedProduct(productId.toString());
            if (cachedProduct != null) {
                return (Product) cachedProduct;
            }
        } catch (Exception e) {
            // If Redis fails, continue with database lookup
            System.err.println("Redis cache error for product " + productId + ": " + e.getMessage());
        }
        
        // If not in cache or Redis fails, get from database
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        
        // Try to cache the product (don't fail if Redis is down)
        try {
            redisService.cacheProduct(productId.toString(), product);
        } catch (Exception e) {
            System.err.println("Redis cache error for product " + productId + ": " + e.getMessage());
        }
        
        return product;
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> searchProducts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllProducts();
        }
        
        try {
            // Try to get from cache first
            Object cachedResults = redisService.getCachedSearchResults(searchTerm.trim());
            if (cachedResults != null) {
                return (List<Product>) cachedResults;
            }
        } catch (Exception e) {
            // If Redis fails, continue with database search
            System.err.println("Redis cache error for search '" + searchTerm + "': " + e.getMessage());
        }
        
        // If not in cache or Redis fails, search database
        List<Product> results = productRepository.searchProducts(searchTerm.trim());
        
        // Try to cache the results (don't fail if Redis is down)
        try {
            redisService.cacheSearchResults(searchTerm.trim(), results);
        } catch (Exception e) {
            System.err.println("Redis cache error for search '" + searchTerm + "': " + e.getMessage());
        }
        
        return results;
    }

    @Override
    public List<Product> getProductsByPriceRange(double minPrice, double maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }

    @Override
    public Product createProduct(Product product) {
        // Validate category exists
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        product.setCategory(category);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long productId, Product product) {
        Product existing = getProductById(productId);
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setStock(product.getStock());
        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            existing.setCategory(category);
        }
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = getProductById(productId);
        productRepository.delete(product);
        
        // Try to invalidate cache (don't fail if Redis is down)
        try {
            redisService.invalidateProductCache(productId.toString());
        } catch (Exception e) {
            System.err.println("Redis invalidation error for product " + productId + ": " + e.getMessage());
        }
    }
} 