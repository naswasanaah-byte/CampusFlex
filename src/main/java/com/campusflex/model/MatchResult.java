package com.campusflex.model;

import java.util.ArrayList;
import java.util.List;

public class MatchResult {
    private int overallScore;
    private boolean hasTimetableConflict = false;
    private List<String> matchReasons = new ArrayList<>();
    private List<String> conflicts = new ArrayList<>();

    private int skillScore;
    private int scheduleScore;
    private int locationScore;
    private int categoryScore;
    private int workTypeScore;
    private int salaryScore;

    public MatchResult() {}

    public MatchResult(int overallScore) {
        this.overallScore = overallScore;
    }

    public void addReason(String reason) {
        this.matchReasons.add(reason);
    }

    public void addConflict(String conflict) {
        this.conflicts.add(conflict);
        this.hasTimetableConflict = true;
    }

    // Getters and Setters
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public boolean isHasTimetableConflict() { return hasTimetableConflict; }
    public void setHasTimetableConflict(boolean hasTimetableConflict) { this.hasTimetableConflict = hasTimetableConflict; }

    public List<String> getMatchReasons() { return matchReasons; }
    public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }

    public List<String> getConflicts() { return conflicts; }
    public void setConflicts(List<String> conflicts) { this.conflicts = conflicts; }

    public int getSkillScore() { return skillScore; }
    public void setSkillScore(int skillScore) { this.skillScore = skillScore; }

    public int getScheduleScore() { return scheduleScore; }
    public void setScheduleScore(int scheduleScore) { this.scheduleScore = scheduleScore; }

    public int getLocationScore() { return locationScore; }
    public void setLocationScore(int locationScore) { this.locationScore = locationScore; }

    public int getCategoryScore() { return categoryScore; }
    public void setCategoryScore(int categoryScore) { this.categoryScore = categoryScore; }

    public int getWorkTypeScore() { return workTypeScore; }
    public void setWorkTypeScore(int workTypeScore) { this.workTypeScore = workTypeScore; }

    public int getSalaryScore() { return salaryScore; }
    public void setSalaryScore(int salaryScore) { this.salaryScore = salaryScore; }
}
