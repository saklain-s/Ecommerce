package com.ecommerce.project.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "simple")
public class SimpleCacheService {

    private final Map<String, Object> cache = new ConcurrentHashMap<>();
    private final Map<String, Long> expirationTimes = new ConcurrentHashMap<>();

    // Product caching
    public void cacheProduct(String productId, Object product) {
        String key = "product:" + productId;
        cache.put(key, product);
        expirationTimes.put(key, System.currentTimeMillis() + TimeUnit.HOURS.toMillis(1));
    }

    public Object getCachedProduct(String productId) {
        String key = "product:" + productId;
        return getFromCache(key);
    }

    public void invalidateProductCache(String productId) {
        String key = "product:" + productId;
        cache.remove(key);
        expirationTimes.remove(key);
    }

    // Category caching
    public void cacheCategory(String categoryId, Object category) {
        String key = "category:" + categoryId;
        cache.put(key, category);
        expirationTimes.put(key, System.currentTimeMillis() + TimeUnit.HOURS.toMillis(2));
    }

    public Object getCachedCategory(String categoryId) {
        String key = "category:" + categoryId;
        return getFromCache(key);
    }

    // General cache operations
    public void set(String key, Object value, long duration, TimeUnit timeUnit) {
        cache.put(key, value);
        expirationTimes.put(key, System.currentTimeMillis() + timeUnit.toMillis(duration));
    }

    public Object get(String key) {
        return getFromCache(key);
    }

    public void delete(String key) {
        cache.remove(key);
        expirationTimes.remove(key);
    }

    public Set<String> getKeysByPattern(String pattern) {
        Set<String> keys = new HashSet<>();
        for (String key : cache.keySet()) {
            if (key.matches(pattern.replace("*", ".*"))) {
                keys.add(key);
            }
        }
        return keys;
    }

    public void clearAllCache() {
        cache.clear();
        expirationTimes.clear();
    }

    public boolean isRedisConnected() {
        return false; // This is a simple cache, not Redis
    }

    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("cache_type", "simple");
        stats.put("total_keys", cache.size());
        stats.put("connected", false);
        return stats;
    }

    private Object getFromCache(String key) {
        Long expirationTime = expirationTimes.get(key);
        if (expirationTime != null && System.currentTimeMillis() > expirationTime) {
            // Key has expired, remove it
            cache.remove(key);
            expirationTimes.remove(key);
            return null;
        }
        return cache.get(key);
    }

    // Clean up expired keys periodically
    public void cleanupExpiredKeys() {
        long currentTime = System.currentTimeMillis();
        Set<String> expiredKeys = new HashSet<>();
        
        for (Map.Entry<String, Long> entry : expirationTimes.entrySet()) {
            if (currentTime > entry.getValue()) {
                expiredKeys.add(entry.getKey());
            }
        }
        
        for (String key : expiredKeys) {
            cache.remove(key);
            expirationTimes.remove(key);
        }
    }
}
