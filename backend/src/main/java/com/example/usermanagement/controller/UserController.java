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
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
     * Get current authenticated user's profile
     * @return current user profile
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        logger.info("getCurrentUser: Received request to get current user profile");
        
        if (authentication == null) {
            // If authentication parameter is null, try to get it from SecurityContext
            authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                logger.error("getCurrentUser: No authentication found in parameter or SecurityContext");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authentication found");
            }
            logger.info("getCurrentUser: Retrieved authentication from SecurityContext");
        }
        
        logger.info("getCurrentUser: Authentication principal: {}, type: {}", 
                authentication.getPrincipal(), authentication.getPrincipal().getClass().getName());
        logger.info("getCurrentUser: Authentication authorities: {}", authentication.getAuthorities());
        
        try {
            String username = null;
            Long userId = null;
            
            // Extract username based on principal type
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                username = userDetails.getUsername();
                userId = userDetails.getId();
                logger.info("getCurrentUser: Extracted username '{}' from UserDetailsImpl, id: {}", 
                        username, userId);
                
                // Try to get user directly by ID if available
                if (userId != null) {
                    Optional<User> userById = userService.getUserById(userId);
                    if (userById.isPresent()) {
                        User user = userById.get();
                        logger.info("getCurrentUser: Successfully retrieved user by ID: {}", user.getName());
                        return ResponseEntity.ok(user);
                    } else {
                        logger.warn("getCurrentUser: User not found by ID: {}, falling back to username", userId);
                    }
                }
            } else if (principal instanceof org.springframework.security.core.userdetails.User) {
                username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
                logger.info("getCurrentUser: Extracted username '{}' from Spring Security User", username);
            } else if (principal instanceof String) {
                username = (String) principal;
                logger.info("getCurrentUser: Using principal directly as username: {}", username);
                
                // Check if it's an anonymous user
                if ("anonymousUser".equals(username)) {
                    logger.error("getCurrentUser: Anonymous user detected");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
                }
            } else {
                logger.error("getCurrentUser: Unsupported principal type: {}", principal.getClass().getName());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Unsupported authentication principal type");
            }
            
            if (username == null || username.isEmpty()) {
                logger.error("getCurrentUser: Could not extract username from authentication principal");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Could not extract username from authentication");
            }
            
            // Get user by username
            logger.info("getCurrentUser: Looking up user by username: {}", username);
            Optional<User> userOpt = userService.getUserByName(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                logger.info("getCurrentUser: Successfully retrieved user: {}, id: {}, roles: {}", 
                        user.getName(), user.getId(), user.getRoles());
                return ResponseEntity.ok(user);
            } else {
                // Try one more approach with findByUsername
                logger.info("getCurrentUser: User not found with getUserByName, trying findByUsername");
                User user = userService.findByUsername(username);
                if (user != null) {
                    logger.info("getCurrentUser: Successfully retrieved user with findByUsername: {}", user.getName());
                    return ResponseEntity.ok(user);
                } else {
                    logger.error("getCurrentUser: User not found with username: {}", username);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("User not found with username: " + username);
                }
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
