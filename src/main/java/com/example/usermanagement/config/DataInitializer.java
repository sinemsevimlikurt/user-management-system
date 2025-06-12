package com.example.usermanagement.config;

import com.example.usermanagement.model.ERole;
import com.example.usermanagement.model.Role;
import com.example.usermanagement.model.User;
import com.example.usermanagement.repository.RoleRepository;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initRoles();
        
        // Create admin and regular users if they don't exist
        createUsersIfNotExist();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(ERole.USER);
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName(ERole.ADMIN);
            roleRepository.save(adminRole);
            
            System.out.println("Roles initialized successfully");
        }
    }

    private void createUsersIfNotExist() {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByName("admin")) {
            User adminUser = new User();
            adminUser.setName("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setEnabled(true);

            Set<Role> adminRoles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            adminRoles.add(adminRole);
            adminUser.setRoles(adminRoles);

            userRepository.save(adminUser);
            System.out.println("Admin user created successfully");
        }
        
        // Create regular user if it doesn't exist
        if (!userRepository.existsByName("user")) {
            User regularUser = new User();
            regularUser.setName("user");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            regularUser.setEnabled(true);

            Set<Role> userRoles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.USER)
                    .orElseThrow(() -> new RuntimeException("Error: User Role not found."));
            userRoles.add(userRole);
            regularUser.setRoles(userRoles);

            userRepository.save(regularUser);
            System.out.println("Regular user created successfully");
        }
    }
}
