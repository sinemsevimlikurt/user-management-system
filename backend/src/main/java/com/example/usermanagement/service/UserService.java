package com.example.usermanagement.service;

import com.example.usermanagement.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    
    Optional<User> getUserById(Long id);
    
    User updateUser(Long id, User userDetails);
    
    void deleteUser(Long id);
}
