package com.example.gym.Models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Trainee")
public class Trainee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private LocalDate joinDate;
    @Column(nullable = false)
    private Long activePlanId;

    public Trainee() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public Long getActivePlanId() {
        return activePlanId;
    }

    public void setActivePlanId(Long activePland) {
        this.activePlanId = activePland;
    }

    public Trainee(Long id, String name, String email, LocalDate joinDate, Long activePlanId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.joinDate = joinDate;
        this.activePlanId = activePlanId;
    }
}
