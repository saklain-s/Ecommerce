package com.ecommerce.project.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis")
@ConditionalOnClass(name = "org.springframework.data.redis.core.RedisTemplate")
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        try {
            RedisTemplate<String, Object> template = new RedisTemplate<>();
            template.setConnectionFactory(connectionFactory);
            
            // Use String serializer for keys
            template.setKeySerializer(new StringRedisSerializer());
            template.setHashKeySerializer(new StringRedisSerializer());
            
            // Use JSON serializer for values
            template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
            template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
            
            template.afterPropertiesSet();
            
            // Test connection (but don't fail if Redis is not available)
            try {
                template.getConnectionFactory().getConnection().ping();
                System.out.println("Redis connection established successfully");
            } catch (Exception e) {
                System.out.println("Redis connection test failed, but continuing with Redis configuration: " + e.getMessage());
            }
            
            return template;
        } catch (Exception e) {
            System.err.println("Failed to configure Redis: " + e.getMessage());
            // Don't throw exception, let the application continue without Redis
            System.out.println("Continuing without Redis cache...");
            return null;
        }
    }
} 