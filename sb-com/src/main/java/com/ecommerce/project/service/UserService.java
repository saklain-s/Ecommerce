package com.ecommerce.project.service;

import com.ecommerce.project.model.User;
import java.util.Optional;

public interface UserService {
    User register(User user);
    Optional<User> login(String username, String password);
    Optional<User> getByUsername(String username);
} 