package com.example.gym.Service;

import com.example.gym.Models.Trainee;
import com.example.gym.Models.WorkoutPlan;
import com.example.gym.Repositories.TraineeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TraineeService {
    @Autowired
    private TraineeRepository  traineeRepository;
//    private List<Trainee> traineePlans=new ArrayList<Trainee>();
    public List<Trainee> getTraineePlans() {
        return traineeRepository.findAll() ;
    }
    public void createTraineePlan(Trainee trainee) {
        traineeRepository.save(trainee);
    }
    public void updateTraineePlan(Long traineeId,Long planId ) {
        List<Trainee> result = getTraineePlans();
        Trainee aTrainee = result.stream().filter(trainee -> trainee.getId().equals(traineeId)).findFirst().orElse(null);
        if(aTrainee!=null) {
            aTrainee.setActivePlanId(planId);
            traineeRepository.save(aTrainee);
        }
        else{
            throw  new RuntimeException("Trainee not found");
        }

    }
    public void deleteTraineePlan(Long traineeId) {
        List<Trainee> result = getTraineePlans();
        Trainee aTrainee=result.stream().filter(trainee -> trainee.getId().equals(traineeId)).findFirst().orElse(null);
        if(aTrainee!=null) {
            aTrainee.setActivePlanId(0L);
            traineeRepository.save(aTrainee);
        }
        else {
            throw  new RuntimeException("Trainee not found");
        }
    }
    public  List<Trainee> getTraineeJoinedAfterDate(LocalDate date) {
        List<Trainee> result = getTraineePlans();
        List<Trainee> plansAfterDate =result.stream().filter(trainee ->trainee.getJoinDate() != null && trainee.getJoinDate().isAfter(date)).collect(Collectors.toList());
        return plansAfterDate;
    }
    public Map<String,List<Trainee>> getTraineesByYear(){
        List<Trainee> result = getTraineePlans();
        Map<String,List<Trainee>> map = result.stream().collect(Collectors.groupingBy(trainee ->String.valueOf(trainee.getJoinDate().getYear())));
        return map;
    }
}
