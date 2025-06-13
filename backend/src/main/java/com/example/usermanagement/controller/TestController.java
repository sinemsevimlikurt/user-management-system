package com.example.usermanagement.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping({"/api/test", "/test"})
public class TestController {
    
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String userAccess() {
        return "User Content.";
    }



    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }
    
    @GetMapping("/debug")
    public String debugEndpoint() {
        return "Debug endpoint working! CORS and basic connectivity is OK.";
    }
}
