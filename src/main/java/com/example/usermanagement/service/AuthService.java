package com.example.usermanagement.service;

import com.example.usermanagement.dto.JwtResponse;
import com.example.usermanagement.dto.LoginRequest;
import com.example.usermanagement.dto.SignupRequest;
import com.example.usermanagement.model.User;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    
    /**
     * Authenticate a user and generate JWT token
     * 
     * @param loginRequest contains username and password
     * @return JwtResponse with token and user details
     */
    JwtResponse authenticateUser(LoginRequest loginRequest);
    
    /**
     * Register a new user
     * 
     * @param signupRequest user registration details
     * @return the created user
     */
    User registerUser(SignupRequest signupRequest);
    
    /**
     * Check if username exists
     * 
     * @param username username to check
     * @return true if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists
     * 
     * @param email email to check
     * @return true if email exists
     */
    boolean existsByEmail(String email);
}
