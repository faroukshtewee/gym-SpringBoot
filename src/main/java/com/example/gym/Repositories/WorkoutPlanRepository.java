package com.example.gym.Repositories;

import com.example.gym.Models.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan,Long>
{
}
