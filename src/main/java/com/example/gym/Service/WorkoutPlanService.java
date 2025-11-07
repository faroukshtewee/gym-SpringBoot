package com.example.gym.Service;

import com.example.gym.Models.WorkoutPlan;
import com.example.gym.Repositories.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;
//    private List<WorkoutPlan> workoutPlans=new ArrayList<WorkoutPlan>();
    private TraineeService  traineeService;
    public List<WorkoutPlan> getWorkoutPlans() {
        return workoutPlanRepository.findAll() ;
    }
    public void createWorkoutPlans(WorkoutPlan workoutPlan) {
        workoutPlanRepository.save(workoutPlan);
    }
}
