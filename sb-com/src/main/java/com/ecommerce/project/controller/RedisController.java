package com.ecommerce.project.controller;

import com.ecommerce.project.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/cache")
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis")
public class RedisController {

    @Autowired(required = false)
    private RedisService redisService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        try {
            Map<String, Object> stats = redisService.getCacheStats();
            stats.put("message", "Cache statistics retrieved successfully");
            stats.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Cache statistics unavailable - Redis not connected");
            error.put("error", e.getMessage());
            error.put("timestamp", System.currentTimeMillis());
            error.put("status", "redis_disconnected");
            return ResponseEntity.ok(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getCacheHealth() {
        Map<String, Object> health = new HashMap<>();
        boolean isConnected = redisService.isRedisConnected();
        
        health.put("status", isConnected ? "healthy" : "unhealthy");
        health.put("connected", isConnected);
        health.put("timestamp", System.currentTimeMillis());
        
        if (!isConnected) {
            health.put("message", "Redis connection failed");
        } else {
            health.put("message", "Redis is connected and operational");
        }
        
        return ResponseEntity.ok(health);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearAllCache() {
        try {
            boolean success = redisService.clearAllCache();
            Map<String, String> response = new HashMap<>();
            
            if (success) {
                response.put("message", "All cache cleared successfully");
                response.put("status", "success");
            } else {
                response.put("message", "Failed to clear cache");
                response.put("status", "error");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear cache: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Map<String, String>> clearProductCache(@PathVariable String productId) {
        try {
            redisService.invalidateProductCache(productId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product cache cleared for ID: " + productId);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear product cache: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/search")
    public ResponseEntity<Map<String, String>> clearSearchCache() {
        try {
            // Clear all search cache keys
            Set<String> searchKeys = redisService.getKeysByPattern("search:*");
            for (String key : searchKeys) {
                redisService.delete(key);
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Search cache cleared - " + searchKeys.size() + " keys removed");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear search cache: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, String>> clearCategoryCache(@PathVariable String categoryId) {
        try {
            redisService.delete("category:" + categoryId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category cache cleared for ID: " + categoryId);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear category cache: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/keys")
    public ResponseEntity<Map<String, Object>> getCacheKeys(@RequestParam(required = false) String pattern) {
        try {
            String searchPattern = pattern != null ? pattern : "*";
            Set<String> keys = redisService.getKeysByPattern(searchPattern);
            
            Map<String, Object> response = new HashMap<>();
            response.put("keys", keys);
            response.put("count", keys.size());
            response.put("pattern", searchPattern);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get cache keys: " + e.getMessage());
            error.put("status", "error");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getCacheInfo() {
        Map<String, Object> info = new HashMap<>();
        
        try {
            // Get basic stats
            Map<String, Object> stats = redisService.getCacheStats();
            info.putAll(stats);
            
            // Get key counts by type
            info.put("product_keys", redisService.getKeysByPattern("product:*").size());
            info.put("search_keys", redisService.getKeysByPattern("search:*").size());
            info.put("session_keys", redisService.getKeysByPattern("session:*").size());
            info.put("cart_keys", redisService.getKeysByPattern("cart:*").size());
            info.put("category_keys", redisService.getKeysByPattern("category:*").size());
            
            info.put("status", "success");
            info.put("timestamp", System.currentTimeMillis());
            
        } catch (Exception e) {
            info.put("error", "Failed to get cache info: " + e.getMessage());
            info.put("status", "error");
        }
        
        return ResponseEntity.ok(info);
    }
} 