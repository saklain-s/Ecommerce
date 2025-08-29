package com.ecommerce.project.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis")
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
            
            // Test connection
            template.getConnectionFactory().getConnection().ping();
            System.out.println("Redis connection established successfully");
            
            return template;
        } catch (Exception e) {
            System.err.println("Failed to configure Redis: " + e.getMessage());
            throw new RuntimeException("Redis configuration failed", e);
        }
    }
} 