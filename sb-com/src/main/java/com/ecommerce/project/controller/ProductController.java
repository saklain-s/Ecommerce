package com.ecommerce.project.controller;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.ecommerce.project.model.User;
import com.ecommerce.project.service.UserService;
import com.ecommerce.project.security.JwtUtil;
import org.springframework.web.multipart.MultipartFile;
import com.ecommerce.project.service.ImageUploadService;

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

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String authHeader) {
        String username = com.ecommerce.project.security.JwtUtil.extractUsernameFromHeader(authHeader);
        User user = userService.getByUsername(username).orElseThrow();
        if (user.getRole() != User.Role.SELLER) {
            return ResponseEntity.status(403).build();
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
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(403).build();
    }
} 