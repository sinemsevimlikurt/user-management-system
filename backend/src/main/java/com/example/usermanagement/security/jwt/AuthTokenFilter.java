package com.example.usermanagement.security.jwt;

import com.example.usermanagement.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Log request details
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        logger.info("AuthTokenFilter: Processing {} request to {}", method, requestURI);
        System.out.println("AuthTokenFilter: Processing " + method + " request to " + requestURI);
        
        // Log all headers for debugging
        System.out.println("AuthTokenFilter: Request headers:");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println("  " + headerName + ": " + request.getHeader(headerName));
        }
        
        // Skip filter for authentication endpoints
        if (requestURI.contains("/api/auth/") || requestURI.contains("/auth/")) {
            logger.info("AuthTokenFilter: Skipping JWT validation for auth endpoint: {}", requestURI);
            System.out.println("AuthTokenFilter: Skipping JWT validation for auth endpoint: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String jwt = parseJwt(request);
            System.out.println("AuthTokenFilter: JWT token extracted: " + (jwt != null ? "token present" : "no token"));
            
            if (jwt != null) {
                // Log token details for debugging
                try {
                    System.out.println("AuthTokenFilter: JWT token details:");
                    System.out.println("  Token: " + jwt);
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    System.out.println("  Username: " + username);
                    System.out.println("  Is valid: " + jwtUtils.validateJwtToken(jwt));
                    System.out.println("  Is expired: " + jwtUtils.isTokenExpired(jwt));
                } catch (Exception e) {
                    System.out.println("  Error parsing token: " + e.getMessage());
                }
                
                if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("AuthTokenFilter: JWT token validated for user: {}", username);
                    System.out.println("AuthTokenFilter: JWT token validated for user: " + username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println("AuthTokenFilter: User details loaded: " + userDetails.getUsername());
                    System.out.println("AuthTokenFilter: Authorities: " + userDetails.getAuthorities());
                    
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("AuthTokenFilter: User {} successfully authenticated and set in SecurityContext", username);
                    System.out.println("AuthTokenFilter: User " + username + " successfully authenticated");
                } else {
                    logger.warn("AuthTokenFilter: Invalid JWT token detected");
                    System.out.println("AuthTokenFilter: Invalid JWT token detected");
                }
            } else if (requestURI.startsWith("/api/") && !requestURI.startsWith("/api/auth/") && !requestURI.startsWith("/api/test/")) {
                // Only log for API requests that aren't auth or test endpoints
                logger.warn("AuthTokenFilter: No JWT token found for protected API endpoint: {}", requestURI);
                System.out.println("AuthTokenFilter: No JWT token found for protected API endpoint: " + requestURI);
                
                // Debug current security context
                Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
                System.out.println("AuthTokenFilter: Current authentication: " + (currentAuth != null ? currentAuth.getName() : "null"));
            }
        } catch (Exception e) {
            logger.error("AuthTokenFilter: Cannot set user authentication: {}", e.getMessage());
            System.err.println("AuthTokenFilter: Cannot set user authentication: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
