package com.ecommerce.project.service;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;



@Service
public class CategoryServiceImpl implements CategoryService {
    //  private List<Category> categories = new ArrayList<>();
    private  Long nextId = 1L;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private RedisService redisService;

    @Override
    public List<Category> getAllCategories() {
        try {
            // Try to get from cache first
            Object cachedCategories = redisService.get("all_categories");
            if (cachedCategories != null) {
                return (List<Category>) cachedCategories;
            }
        } catch (Exception e) {
            // If Redis fails, continue with database lookup
            System.err.println("Redis cache error for categories: " + e.getMessage());
        }
        
        // If not in cache or Redis fails, get from database
        List<Category> categories = categoryRepository.findAll();
        
        // Try to cache the categories (don't fail if Redis is down)
        try {
            redisService.set("all_categories", categories, 2, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis cache error for categories: " + e.getMessage());
        }
        
        return categories;
    }

    @Override
    public void createCategory(Category category) {
        //category.setCategoryId(nextId++);
        categoryRepository.save(category);
        
        // Try to invalidate categories cache (don't fail if Redis is down)
        try {
            redisService.delete("all_categories");
        } catch (Exception e) {
            System.err.println("Redis cache invalidation error: " + e.getMessage());
        }
    }

    @Override
    public String deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource Not Found"));
        categoryRepository.delete(category);

        // Try to invalidate categories cache (don't fail if Redis is down)
        try {
            redisService.delete("all_categories");
        } catch (Exception e) {
            System.err.println("Redis cache invalidation error: " + e.getMessage());
        }
        
        return "Category with categoryId: "+categoryId+" deleted successfully";
    }

    @Override
    public Category updateCategory(Category category, Long categoryId) {

        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        category.setCategoryId(categoryId);
        savedCategory = categoryRepository.save(category);
        
        // Try to invalidate categories cache (don't fail if Redis is down)
        try {
            redisService.delete("all_categories");
        } catch (Exception e) {
            System.err.println("Redis cache invalidation error: " + e.getMessage());
        }
        
        return savedCategory;
    }

}
