package com.example.usermanagement.service;

import com.example.usermanagement.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    
    Optional<User> getUserById(Long id);
    
    User updateUser(Long id, User userDetails);
    
    void deleteUser(Long id);
    
    /**
     * Find a user by username
     * @param username the username to search for
     * @return the user if found, null otherwise
     */
    User findByUsername(String username);
    
    /**
     * Get a user by name
     * @param name the name to search for
     * @return Optional containing the user if found
     */
    Optional<User> getUserByName(String name);
}
