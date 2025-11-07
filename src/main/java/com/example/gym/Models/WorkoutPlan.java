package com.example.gym.Models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "WorkoutPlan")
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String describtion;
    @Column(nullable = false)
    private int difficulty;

    public WorkoutPlan() {
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

    public String getDescribtion() {
        return describtion;
    }

    public void setDescribtion(String describtion) {
        this.describtion = describtion;
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    public WorkoutPlan(Long id, String name, String describtion, int difficulty) {
        this.id = id;
        this.name = name;
        this.describtion = describtion;
        this.difficulty = difficulty;
    }


}
