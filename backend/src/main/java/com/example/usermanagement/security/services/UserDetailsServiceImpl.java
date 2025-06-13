package com.example.usermanagement.security.services;

import com.example.usermanagement.model.User;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("UserDetailsServiceImpl: Loading user by username: " + username);
        try {
            User user = userRepository.findByName(username)
                    .orElseThrow(() -> {
                        System.err.println("UserDetailsServiceImpl: User not found with username: " + username);
                        return new UsernameNotFoundException("User Not Found with username: " + username);
                    });

            System.out.println("UserDetailsServiceImpl: User found: " + user.getName() + ", Enabled: " + user.isEnabled());
            System.out.println("UserDetailsServiceImpl: User roles: " + user.getRoles());
            
            UserDetails userDetails = UserDetailsImpl.build(user);
            System.out.println("UserDetailsServiceImpl: UserDetails built successfully");
            return userDetails;
        } catch (Exception e) {
            System.err.println("UserDetailsServiceImpl: Error loading user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
