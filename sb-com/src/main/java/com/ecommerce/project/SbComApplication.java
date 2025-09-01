package com.ecommerce.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;



@SpringBootApplication
public class SbComApplication {

	public static void main(String[] args) {
		try {
			System.out.println("Starting ShopAura Ecommerce Application...");
			System.out.println("Cache type: " + System.getProperty("spring.cache.type", "simple"));
			SpringApplication.run(SbComApplication.class, args);
			System.out.println("ShopAura Application started successfully!");
		} catch (Exception e) {
			System.err.println("Failed to start ShopAura Application: " + e.getMessage());
			e.printStackTrace();
			System.exit(1);
		}
	}
   
	@Bean
	public CommandLineRunner initCategories(CategoryRepository categoryRepository) {
		return args -> {
			try {
				if (categoryRepository.count() == 0) {
					System.out.println("Initializing default categories...");
					List<Category> categories = List.of(
						new Category(null, "Electronics"),
						new Category(null, "Fashion"),
						new Category(null, "Home"),
						new Category(null, "Books"),
						new Category(null, "Sports"),
						new Category(null, "Beauty"),
						new Category(null, "Toys"),
						new Category(null, "Grocery")
					);
					categoryRepository.saveAll(categories);
					System.out.println("Default categories initialized successfully! Count: " + categories.size());
				} else {
					System.out.println("Categories already exist. Count: " + categoryRepository.count());
				}
			} catch (Exception e) {
				System.err.println("Error initializing categories: " + e.getMessage());
				e.printStackTrace();
			}
		};
	}

	@Bean
	public CommandLineRunner initFeaturedProducts(CategoryRepository categoryRepository, ProductRepository productRepository) {
		return args -> {
			try {
				// Clear existing products and always seed
				productRepository.deleteAll();
				System.out.println("Initializing featured products...");
					
					// Get all categories
					List<Category> categories = categoryRepository.findAll();
					
					// Featured products data (matching the frontend)
					Object[][] featuredProducts = {
						// Electronics
						{"Wireless Headphones", "High-fidelity sound, noise cancelling.", 1799.0, 12, "Electronics", "https://images.pexels.com/photos/374777/pexels-photo-374777.jpeg?auto=compress&w=400"},
						{"Smartphone", "Latest model, stunning display.", 25000.0, 8, "Electronics", "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400"},
						{"Smartwatch", "Track fitness and notifications.", 5500.0, 15, "Electronics", "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&w=400"},
						{"Bluetooth Speaker", "Portable, powerful sound.", 1500.0, 20, "Electronics", "https://images.pexels.com/photos/33080375/pexels-photo-33080375.jpeg"},
						
						// Fashion
						{"Denim Jacket", "Classic style, all seasons.", 1599.0, 10, "Fashion", "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=400"},
						{"Sneakers", "Comfortable and trendy.", 3200.0, 18, "Fashion", "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=400"},
						{"Sunglasses", "UV protection, stylish.", 1200.0, 25, "Fashion", "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&w=400"},
						{"Leather Handbag", "Premium quality, spacious.", 4500.0, 7, "Fashion", "https://images.pexels.com/photos/5706269/pexels-photo-5706269.jpeg"},
						
						// Home
						{"Table Lamp", "Modern design, warm light.", 1300.0, 14, "Home", "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg"},
						{"Cushion Set", "Soft and colorful.", 2000.0, 30, "Home", "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&w=400"},
						{"Wall Clock", "Silent, elegant look.", 900.0, 22, "Home", "https://images.pexels.com/photos/191703/pexels-photo-191703.jpeg"},
						{"Ceramic Vase", "Handcrafted, unique.", 1500.0, 9, "Home", "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&w=400"},
						
						// Books
						{"Mystery Novel", "A thrilling page-turner.", 300.0, 40, "Books", "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400"},
						{"Cookbook", "Delicious recipes inside.", 400.0, 16, "Books", "https://images.pexels.com/photos/8851929/pexels-photo-8851929.jpeg"},
						{"Science Fiction", "Explore new worlds.", 250.0, 12, "Books", "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&w=400"},
						{"Biography", "Inspiring life story.", 350.0, 20, "Books", "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&w=400"},
						
						// Sports
						{"Football", "Official size, durable.", 1000.0, 17, "Sports", "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&w=400"},
						{"Yoga Mat", "Non-slip, eco-friendly.", 700.0, 23, "Sports", "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&w=400"},
						{"Tennis Racket", "Lightweight, strong grip.", 1700.0, 6, "Sports", "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&w=400"},
						{"Dumbbell Set", "Adjustable weights.", 3000.0, 11, "Sports", "https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg"},
						
						// Beauty
						{"Face Serum", "Glowing skin formula.", 1200.0, 19, "Beauty", "https://images.pexels.com/photos/8140913/pexels-photo-8140913.jpeg"},
						{"Lipstick Set", "Vibrant, long-lasting.", 900.0, 14, "Beauty", "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=400"},
						{"Hair Dryer", "Quick dry, low noise.", 1800.0, 8, "Beauty", "https://images.pexels.com/photos/973406/pexels-photo-973406.jpeg"},
						{"Body Lotion", "Moisturizing, non-greasy.", 600.0, 21, "Beauty", "https://images.pexels.com/photos/27363151/pexels-photo-27363151.jpeg"},
						
						// Toys
						{"Building Blocks", "Creative fun for kids.", 1100.0, 30, "Toys", "https://images.pexels.com/photos/105855/pexels-photo-105855.jpeg"},
						{"Plush Bear", "Soft and cuddly.", 800.0, 18, "Toys", "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&w=400"},
						{"Puzzle Game", "Challenging and fun.", 950.0, 22, "Toys", "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&w=400"},
						{"Remote Car", "Fast and rechargeable.", 1600.0, 9, "Toys", "https://images.pexels.com/photos/14857461/pexels-photo-14857461.jpeg"},
						
						// Grocery
						{"Organic Apples", "Fresh and juicy.", 180.0, 50, "Grocery", "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=400"},
						{"Almonds", "Healthy snack.", 120.0, 35, "Grocery", "https://images.pexels.com/photos/57042/pexels-photo-57042.jpeg"},
						{"Olive Oil", "Extra virgin, pure.", 450.0, 20, "Grocery", "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&w=400"},
						{"Brown Rice", "Whole grain, nutritious.", 100.0, 28, "Grocery", "https://images.pexels.com/photos/4110253/pexels-photo-4110253.jpeg"}
					};
					
					// Create products
					List<Product> savedProducts = new ArrayList<>();
					for (Object[] productData : featuredProducts) {
						String name = (String) productData[0];
						String description = (String) productData[1];
						double price = (Double) productData[2];
						int stock = (Integer) productData[3];
						String categoryName = (String) productData[4];
						String imageUrl = (String) productData[5];
						
						// Find the category
						Category category = categories.stream()
							.filter(cat -> cat.getCategoryName().equals(categoryName))
							.findFirst()
							.orElse(null);
						
						if (category != null) {
							Product product = new Product();
							product.setName(name);
							product.setDescription(description);
							product.setPrice(price);
							product.setStock(stock);
							product.setCategory(category);
							product.setImageUrl(imageUrl);
							product.setCreatedBy(null); // No specific user for featured products
							
							Product savedProduct = productRepository.save(product);
							savedProducts.add(savedProduct);
							System.out.println("Saved product: " + savedProduct.getName() + " (ID: " + savedProduct.getProductId() + ")");
						} else {
							System.out.println("Category not found for: " + categoryName);
						}
					}
					
					System.out.println("Total products saved: " + savedProducts.size());
					System.out.println("Total products in database: " + productRepository.count());
					
					System.out.println("Featured products initialized successfully!");
			} catch (Exception e) {
				System.out.println("Error initializing featured products: " + e.getMessage());
			}
		};
	}
}
/*
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



@Service
public class CategoryServiceImpl implements CategoryService {
  //  private List<Category> categories = new ArrayList<>();
    private  Long nextId = 1L;

@Autowired
private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public void createCatergory(Category category) {
        //category.setCategoryId(nextId++);
        categoryRepository.save(category);
    }

    @Override
    public String deleteCategory(Long categoryId) {
        List<Category> categories = categoryRepository.findAll();
        Category category = categories.stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource Not Found"));



        categoryRepository.delete(category);

        return "Category with categoryId: "+categoryId+" deleted successfully";
    }

    @Override
    public Category updateCategory(Category category, Long categoryId) {
        List<Category> categories = categoryRepository.findAll();

        Optional <Category> optionalCategory = categories.stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .findFirst();
        if(optionalCategory.isPresent()){
            Category existingCategory = optionalCategory.get();
            existingCategory.setCategoryName(category.getCategoryName());
            Category savedCategory = categoryRepository.save(existingCategory);
            return savedCategory;
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource Not Found");
        }

    }
}

 */
