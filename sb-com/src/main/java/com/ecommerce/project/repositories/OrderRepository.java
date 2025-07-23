package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser(User user);
} 