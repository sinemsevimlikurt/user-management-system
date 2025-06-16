package com.example.usermanagement.controller;

import com.example.usermanagement.dto.MessageResponse;
import com.example.usermanagement.model.User;
import com.example.usermanagement.security.services.UserDetailsImpl;
import com.example.usermanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserService userService;
    
    /**
     * Get all users - accessible only to admins
     * @return list of all users
     */
    @GetMapping({"all", "/all"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("getAllUsers: Received request to get all users");
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
     * Get current authenticated user's profile
     * @return current user profile
     */
    @GetMapping({"/me", "me"})
    public ResponseEntity<?> getCurrentUser() {
        logger.info("getCurrentUser: Received request to get current user profile");
        
        try {
            // Get authentication from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.error("getCurrentUser: No authentication found in SecurityContext");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authentication found");
            }
            
            // Get principal from authentication
            Object principal = authentication.getPrincipal();
            logger.info("getCurrentUser: Authentication principal type: {}", principal != null ? principal.getClass().getName() : "null");
            
            // Handle UserDetailsImpl case (most common)
            if (principal instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                Long userId = userDetails.getId();
                String username = userDetails.getUsername();
                
                logger.info("getCurrentUser: Found UserDetailsImpl with ID: {} and username: {}", userId, username);
                
                // Try to get user by ID first
                if (userId != null) {
                    try {
                        Optional<User> userOpt = userService.getUserById(userId);
                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            logger.info("getCurrentUser: Successfully retrieved user by ID: {}", user.getId());
                            return ResponseEntity.ok(user);
                        } else {
                            logger.warn("getCurrentUser: User not found by ID: {}", userId);
                        }
                    } catch (Exception e) {
                        logger.error("getCurrentUser: Error retrieving user by ID: {}", userId, e);
                    }
                }
                
                // If ID lookup fails, try by username
                if (username != null && !username.isEmpty()) {
                    try {
                        User user = userService.findByUsername(username);
                        if (user != null) {
                            logger.info("getCurrentUser: Successfully retrieved user by username: {}", username);
                            return ResponseEntity.ok(user);
                        } else {
                            logger.warn("getCurrentUser: User not found by username: {}", username);
                        }
                    } catch (Exception e) {
                        logger.error("getCurrentUser: Error retrieving user by username: {}", username, e);
                    }
                }
                
                logger.error("getCurrentUser: User not found with ID: {} and username: {}", userId, username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            } 
            // Handle String username case
            else if (principal instanceof String) {
                String username = (String) principal;
                if ("anonymousUser".equals(username)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Anonymous user not allowed");
                }
                
                try {
                    User user = userService.findByUsername(username);
                    if (user != null) {
                        return ResponseEntity.ok(user);
                    }
                } catch (Exception e) {
                    logger.error("getCurrentUser: Error retrieving user by string username: {}", username, e);
                }
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + username);
            }
            // Unsupported principal type
            else {
                logger.error("getCurrentUser: Unsupported principal type: {}", principal != null ? principal.getClass().getName() : "null");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Unsupported authentication type");
            }
        } catch (Exception e) {
            logger.error("getCurrentUser: Error retrieving user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user profile: " + e.getMessage());
        }
    }
    
    /**
     * Get user by ID - accessible to admins or the user themselves
     * @param id user ID
     * @return user details
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(authentication, #id)")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update user - accessible to admins or the user themselves
     * @param id user ID
     * @param userDetails updated user details
     * @return updated user
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isUserSelf(authentication, #id)")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }
    
    /**
     * Delete user - accessible only to admins
     * @param id user ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
