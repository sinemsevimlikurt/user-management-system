package com.example.usermanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;
    
    // Constructors
    public Role() {
    }
    
    public Role(Long id, ERole name) {
        this.id = id;
        this.name = name;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ERole getName() {
        return name;
    }
    
    public void setName(ERole name) {
        this.name = name;
    }
}
