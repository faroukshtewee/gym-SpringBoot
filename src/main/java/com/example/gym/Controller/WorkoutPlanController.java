package com.example.gym.Controller;

import com.example.gym.Models.WorkoutPlan;
import com.example.gym.Repositories.WorkoutPlanRepository;
import com.example.gym.Service.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class WorkoutPlanController {
    @Autowired
    private WorkoutPlanService workoutPlanService;
    @GetMapping("")
    public List<WorkoutPlan> getWorkoutPlans() {
        return workoutPlanService.getWorkoutPlans();
    }
    @PostMapping("")
    public void createWorkoutPlans(@RequestBody WorkoutPlan workoutPlan) {
        workoutPlanService.createWorkoutPlans(workoutPlan);
    }
}
