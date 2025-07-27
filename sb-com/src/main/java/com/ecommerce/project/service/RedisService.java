package com.ecommerce.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String PRODUCT_CACHE_PREFIX = "product:";
    private static final String USER_SESSION_PREFIX = "session:";
    private static final String CART_PREFIX = "cart:";
    private static final String SEARCH_CACHE_PREFIX = "search:";
    private static final String CATEGORY_CACHE_PREFIX = "category:";
    private static final String STATS_PREFIX = "stats:";

    // Product caching with enhanced features
    public void cacheProduct(String productId, Object product) {
        try {
            String key = PRODUCT_CACHE_PREFIX + productId;
            redisTemplate.opsForValue().set(key, product, 1, TimeUnit.HOURS);
            updateCacheStats("product_cache_hits", 1);
        } catch (Exception e) {
            // Log error but don't break application
            System.err.println("Redis cache error: " + e.getMessage());
        }
    }

    public Object getCachedProduct(String productId) {
        try {
            String key = PRODUCT_CACHE_PREFIX + productId;
            Object result = redisTemplate.opsForValue().get(key);
            if (result != null) {
                updateCacheStats("product_cache_hits", 1);
            } else {
                updateCacheStats("product_cache_misses", 1);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Redis get error: " + e.getMessage());
            return null;
        }
    }

    public void invalidateProductCache(String productId) {
        try {
            String key = PRODUCT_CACHE_PREFIX + productId;
            redisTemplate.delete(key);
            updateCacheStats("product_cache_invalidations", 1);
        } catch (Exception e) {
            System.err.println("Redis invalidation error: " + e.getMessage());
        }
    }

    // Category caching
    public void cacheCategory(String categoryId, Object category) {
        try {
            String key = CATEGORY_CACHE_PREFIX + categoryId;
            redisTemplate.opsForValue().set(key, category, 2, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis category cache error: " + e.getMessage());
        }
    }

    public Object getCachedCategory(String categoryId) {
        try {
            String key = CATEGORY_CACHE_PREFIX + categoryId;
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis category get error: " + e.getMessage());
            return null;
        }
    }

    // User session caching with enhanced TTL
    public void cacheUserSession(String username, Object sessionData) {
        try {
            String key = USER_SESSION_PREFIX + username;
            redisTemplate.opsForValue().set(key, sessionData, 24, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis session cache error: " + e.getMessage());
        }
    }

    public Object getUserSession(String username) {
        try {
            String key = USER_SESSION_PREFIX + username;
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis session get error: " + e.getMessage());
            return null;
        }
    }

    public void invalidateUserSession(String username) {
        try {
            String key = USER_SESSION_PREFIX + username;
            redisTemplate.delete(key);
        } catch (Exception e) {
            System.err.println("Redis session invalidation error: " + e.getMessage());
        }
    }

    // Cart caching with user-specific TTL
    public void cacheCart(String userId, Object cartData) {
        try {
            String key = CART_PREFIX + userId;
            redisTemplate.opsForValue().set(key, cartData, 2, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis cart cache error: " + e.getMessage());
        }
    }

    public Object getCachedCart(String userId) {
        try {
            String key = CART_PREFIX + userId;
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis cart get error: " + e.getMessage());
            return null;
        }
    }

    public void invalidateCartCache(String userId) {
        try {
            String key = CART_PREFIX + userId;
            redisTemplate.delete(key);
        } catch (Exception e) {
            System.err.println("Redis cart invalidation error: " + e.getMessage());
        }
    }

    // Search result caching with intelligent TTL
    public void cacheSearchResults(String searchTerm, Object results) {
        try {
            String key = SEARCH_CACHE_PREFIX + searchTerm.hashCode();
            // Shorter TTL for search results as they change frequently
            redisTemplate.opsForValue().set(key, results, 30, TimeUnit.MINUTES);
        } catch (Exception e) {
            System.err.println("Redis search cache error: " + e.getMessage());
        }
    }

    public Object getCachedSearchResults(String searchTerm) {
        try {
            String key = SEARCH_CACHE_PREFIX + searchTerm.hashCode();
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis search get error: " + e.getMessage());
            return null;
        }
    }

    // Cache statistics
    private void updateCacheStats(String statName, int increment) {
        try {
            String key = STATS_PREFIX + statName;
            redisTemplate.opsForValue().increment(key, increment);
            // Set TTL for stats
            redisTemplate.expire(key, 24, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis stats error: " + e.getMessage());
        }
    }

    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("product_cache_hits", getStatValue("product_cache_hits"));
            stats.put("product_cache_misses", getStatValue("product_cache_misses"));
            stats.put("product_cache_invalidations", getStatValue("product_cache_invalidations"));
            stats.put("total_keys", redisTemplate.getConnectionFactory().getConnection().dbSize());
            stats.put("redis_status", "connected");
        } catch (Exception e) {
            stats.put("redis_status", "disconnected");
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    private Long getStatValue(String statName) {
        try {
            String key = STATS_PREFIX + statName;
            Object value = redisTemplate.opsForValue().get(key);
            return value != null ? Long.valueOf(value.toString()) : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    // General cache operations with error handling
    public void set(String key, Object value, long timeout, TimeUnit unit) {
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } catch (Exception e) {
            System.err.println("Redis set error: " + e.getMessage());
        }
    }

    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis get error: " + e.getMessage());
            return null;
        }
    }

    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            System.err.println("Redis delete error: " + e.getMessage());
        }
    }

    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            System.err.println("Redis exists error: " + e.getMessage());
            return false;
        }
    }

    // Clear all cache with confirmation
    public boolean clearAllCache() {
        try {
            redisTemplate.getConnectionFactory().getConnection().flushDb();
            return true;
        } catch (Exception e) {
            System.err.println("Redis clear all error: " + e.getMessage());
            return false;
        }
    }

    // Get all keys with pattern
    public Set<String> getKeysByPattern(String pattern) {
        try {
            return redisTemplate.keys(pattern);
        } catch (Exception e) {
            System.err.println("Redis keys error: " + e.getMessage());
            return Set.of();
        }
    }

    // Health check
    public boolean isRedisConnected() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
} 