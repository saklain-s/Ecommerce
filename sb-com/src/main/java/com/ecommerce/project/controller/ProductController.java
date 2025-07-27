package com.ecommerce.project.controller;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.ecommerce.project.model.User;
import com.ecommerce.project.service.UserService;
import com.ecommerce.project.security.JwtUtil;
import org.springframework.web.multipart.MultipartFile;
import com.ecommerce.project.service.ImageUploadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;
    @Autowired
    private ImageUploadService imageUploadService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Product>> getPaginatedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (page < 0 || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam double minPrice, 
            @RequestParam double maxPrice) {
        return ResponseEntity.ok(productService.getProductsByPriceRange(minPrice, maxPrice));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        List<Product> allProducts = productService.getAllProducts();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalProducts", allProducts.size());
        stats.put("totalCategories", allProducts.stream()
                .map(p -> p.getCategory().getCategoryName())
                .distinct()
                .count());
        stats.put("averagePrice", allProducts.stream()
                .mapToDouble(Product::getPrice)
                .average()
                .orElse(0.0));
        stats.put("totalStock", allProducts.stream()
                .mapToInt(Product::getStock)
                .sum());
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = com.ecommerce.project.security.JwtUtil.extractUsernameFromHeader(authHeader);
            User user = userService.getByUsername(username).orElseThrow();
            if (user.getRole() != User.Role.SELLER) {
                return ResponseEntity.status(403).build();
            }
            
            // Validate product data
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (product.getPrice() <= 0) {
                return ResponseEntity.badRequest().build();
            }
            if (product.getStock() < 0) {
                return ResponseEntity.badRequest().build();
            }
            
            product.setCreatedBy(user);
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = imageUploadService.uploadFile(image);
                    product.setImageUrl(imageUrl);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
            return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = com.ecommerce.project.security.JwtUtil.extractUsernameFromHeader(authHeader);
        User user = userService.getByUsername(username).orElseThrow();
        if (user.getRole() == User.Role.SELLER) {
            Product product = productService.getProductById(id);
            // Only allow sellers to delete their own products
            if (product.getCreatedBy() != null && product.getCreatedBy().getUsername().equals(username)) {
                productService.deleteProduct(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(403).body(null); // Forbidden - not the owner
            }
        }
        return ResponseEntity.status(403).build();
    }
} 