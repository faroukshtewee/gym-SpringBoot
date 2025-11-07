package com.example.gym.Controller;

import com.example.gym.Models.Trainee;
import com.example.gym.Repositories.TraineeRepository;
import com.example.gym.Service.TraineeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/trainees")
@CrossOrigin
public class TraineeController {
    @Autowired
    private TraineeService traineeService;

    @GetMapping("")
    public List<Trainee> getTraineePlans() {
        return traineeService.getTraineePlans();
    }

    @PostMapping("")
    public void createTraineePlan(@RequestBody Trainee trainee) {
        traineeService.createTraineePlan(trainee);
    }

    @PutMapping("/{traineeId}/assign-plan/{planId}")
    public void updateTraineePlan(@PathVariable Long traineeId, @PathVariable Long planId) {
        traineeService.updateTraineePlan(traineeId, planId);
    }
    @PutMapping("/{traineeId}/remove-plan")
    public void deleteTraineePlan(@PathVariable Long traineeId){
        traineeService.deleteTraineePlan(traineeId);
    }
    @GetMapping("/joined-after/{date}")
    public  List<Trainee> getTraineePlansAfterDate(@PathVariable LocalDate date) {
        return traineeService.getTraineePlansAfterDate(date);
    }
@GetMapping("/grouped-by-year")
public Map<String,Integer> getTraineePlansCountByYear(){
        return traineeService.getTraineePlansCountByYear();
}
}
