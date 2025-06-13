package com.example.usermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("CorsConfig: Adding CORS mappings");
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }

    @Bean
    @Primary
    public CorsFilter corsFilter() {
        System.out.println("CorsConfig: Configuring CORS filter");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins for development
        // When allowCredentials is true, we can't use addAllowedOrigin
        // Instead, we need to use setAllowedOrigins
        config.setAllowedOrigins(java.util.Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ));
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow credentials like cookies, authorization headers, etc.
        config.setAllowCredentials(true);
        
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", config);
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/api/auth/**", config);
        
        System.out.println("CorsConfig: CORS filter configured successfully");
        return new CorsFilter(source);
    }
}
