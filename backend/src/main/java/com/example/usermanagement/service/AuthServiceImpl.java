package com.example.usermanagement.service;

import com.example.usermanagement.dto.JwtResponse;
import com.example.usermanagement.dto.LoginRequest;
import com.example.usermanagement.dto.SignupRequest;
import com.example.usermanagement.model.ERole;
import com.example.usermanagement.model.Role;
import com.example.usermanagement.model.User;
import com.example.usermanagement.repository.RoleRepository;
import com.example.usermanagement.repository.UserRepository;
import com.example.usermanagement.security.jwt.JwtUtils;
import com.example.usermanagement.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        try {
            System.out.println("AuthServiceImpl: Attempting to authenticate user: " + loginRequest.getName());
            
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getName(), loginRequest.getPassword()));

            System.out.println("AuthServiceImpl: Authentication successful for user: " + loginRequest.getName());
            
            // Set the authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);
            System.out.println("AuthServiceImpl: JWT token generated successfully");
            
            // Get user details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
            
            System.out.println("AuthServiceImpl: User roles: " + roles);

            // Return JWT response with token and user details
            return new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(), // UserDetailsImpl still uses getUsername() method
                    userDetails.getEmail(),
                    roles
            );
        } catch (Exception e) {
            System.err.println("AuthServiceImpl: Authentication error for user: " + loginRequest.getName());
            System.err.println("AuthServiceImpl: Error details: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public User registerUser(SignupRequest signupRequest) {
        // Create new user
        User user = new User();
        user.setName(signupRequest.getName()); // Using name field
        user.setEmail(signupRequest.getEmail());
        
        // Encode password
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        
        // Set roles
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Default role is USER
            Role userRole = roleRepository.findByName(ERole.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Default role USER not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Admin role not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.USER)
                                .orElseThrow(() -> new RuntimeException("Error: Default role USER not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        
        // Save user to database
        return userRepository.save(user);
    }

    @Override
    public boolean existsByName(String name) {
        return userRepository.existsByName(name);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
