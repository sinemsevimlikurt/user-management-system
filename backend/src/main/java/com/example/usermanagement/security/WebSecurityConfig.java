package com.example.usermanagement.security;

import com.example.usermanagement.security.jwt.AuthEntryPointJwt;
import com.example.usermanagement.security.jwt.AuthTokenFilter;
import com.example.usermanagement.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // We're using WebConfig for CORS configuration instead
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("WebSecurityConfig: Configuring security filter chain");
        
        // Disable CSRF as we're using stateless JWT authentication
        http.csrf(csrf -> csrf.disable());
        
        // Configure CORS - use default configuration which will pick up our WebConfig
        http.cors(cors -> {});
        
        // Configure exception handling
        http.exceptionHandling(exception -> 
            exception.authenticationEntryPoint(unauthorizedHandler)
        );
        
        // Configure session management to be stateless
        http.sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        
        // Configure authorization rules
        http.authorizeHttpRequests(auth -> 
            auth
                .requestMatchers("/api/auth/**", "/auth/**", "/api/auth/signin", "/auth/signin").permitAll()
                .requestMatchers("/api/test/**", "/test/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
        );
        
        // Log the security configuration
        System.out.println("WebSecurityConfig: Explicitly allowing access to /api/auth/signin and /auth/signin");
        
        // Configure authentication provider
        http.authenticationProvider(authenticationProvider());
        
        // Add JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        // Configure frame options for H2 console
        http.headers(headers -> 
            headers.frameOptions(frameOption -> frameOption.sameOrigin())
        );
        
        System.out.println("WebSecurityConfig: Security filter chain configured successfully");
        return http.build();
    }
}
