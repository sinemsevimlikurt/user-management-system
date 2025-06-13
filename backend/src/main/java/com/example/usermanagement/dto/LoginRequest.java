package com.example.usermanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String password;
    
    // Constructors
    public LoginRequest() {
    }
    
    public LoginRequest(String name, String password) {
        this.name = name;
        this.password = password;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
