package com.example.usermanagement.dto;

public class MessageResponse {
    private String message;
    
    // Constructor
    public MessageResponse(String message) {
        this.message = message;
    }
    
    // Getter and Setter
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
