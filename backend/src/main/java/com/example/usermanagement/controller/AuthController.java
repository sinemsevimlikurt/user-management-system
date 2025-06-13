package com.example.usermanagement.controller;

import com.example.usermanagement.model.Role;
import com.example.usermanagement.model.User;
import com.example.usermanagement.dto.LoginRequest;
import com.example.usermanagement.dto.SignupRequest;
import com.example.usermanagement.dto.JwtResponse;
import com.example.usermanagement.dto.MessageResponse;
import com.example.usermanagement.repository.RoleRepository;
import com.example.usermanagement.repository.UserRepository;
import com.example.usermanagement.security.jwt.JwtUtils;
import com.example.usermanagement.security.services.UserDetailsImpl;
import com.example.usermanagement.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping({"/api/auth", "/auth"})
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("========== LOGIN ATTEMPT ==========");
            logger.info("Login attempt for user: {}", loginRequest.getName());
            logger.info("Request headers: {}", SecurityContextHolder.getContext());
            
            // Log the request details
            logger.info("Login request details - Username: {}, Password length: {}", 
                loginRequest.getName(), 
                loginRequest.getPassword() != null ? loginRequest.getPassword().length() : 0);
            
            // Print debug info about the user in the database
            try {
                logger.info("Checking if user exists in database...");
                boolean userExists = authService.existsByName(loginRequest.getName());
                logger.info("User '{}' exists in database: {}", loginRequest.getName(), userExists);
            } catch (Exception e) {
                logger.error("Error checking user existence: {}", e.getMessage());
            }
            
            // Call the service with the entire LoginRequest object
            logger.info("Calling authService.authenticateUser...");
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            
            // Log successful authentication details
            logger.info("Login successful for user: {}", loginRequest.getName());
            logger.info("Generated JWT token length: {}", jwtResponse.getToken().length());
            logger.info("JWT token: {}", jwtResponse.getToken().substring(0, Math.min(20, jwtResponse.getToken().length())) + "...");
            
            // Set CORS headers explicitly in the response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Access-Control-Allow-Origin", "http://localhost:5174");
            headers.add("Access-Control-Allow-Credentials", "true");
            headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
            
            logger.info("Returning successful response with token");
            return ResponseEntity.ok().headers(headers).body(jwtResponse);
        } catch (Exception e) {
            logger.error("========== LOGIN FAILED ==========");
            logger.error("Login failed for user: {}, Error: {}", loginRequest.getName(), e.getMessage());
            logger.error("Exception stack trace:", e);
            
            // Set CORS headers even in error response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Access-Control-Allow-Origin", "http://localhost:5174");
            headers.add("Access-Control-Allow-Credentials", "true");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .headers(headers)
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check if name exists
        if (authService.existsByName(signUpRequest.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email exists
        if (authService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Register the user
        authService.registerUser(signUpRequest);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
