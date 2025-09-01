package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.service.UserService;
import com.ecommerce.project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "User service is running");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User created = userService.register(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        return userService.login(username, password)
                .map(user -> {
                    String token = jwtUtil.generateToken(user);
                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Invalid credentials");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
                });
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username, @RequestHeader("Authorization") String authHeader) {
        // Extract token from Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        String token = authHeader.substring(7);
        
        try {
            // Validate token and get authenticated username
            String authenticatedUsername = jwtUtil.extractUsername(token);
            
            // Check if user is requesting their own profile or is an admin
            if (!authenticatedUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            
            return userService.getByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestBody Map<String, String> body, @RequestHeader("Authorization") String authHeader) {
        // Extract token from Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        
        String token = authHeader.substring(7);
        
        try {
            // Validate token and get authenticated username
            String authenticatedUsername = jwtUtil.extractUsername(token);
            
            // Check if user is updating their own password
            if (!authenticatedUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
            }
            
            String newPassword = body.get("password");
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            return userService.getByUsername(username)
                .map(user -> {
                    user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(newPassword));
                    userService.register(user); // save updated user
                    return ResponseEntity.ok("Password updated successfully");
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }
} 