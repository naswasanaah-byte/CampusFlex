package com.campusflex.service;

import com.campusflex.model.Job;
import com.campusflex.model.MatchResult;
import com.campusflex.model.Skill;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.TimetableEntry;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class MatchingService {

    private final TimetableService timetableService;

    public MatchingService(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    public MatchResult calculateMatch(StudentProfile student, Job job, List<TimetableEntry> studentTimetable) {
        MatchResult result = new MatchResult();
        if (student == null || job == null) {
            return result;
        }

        // 1. Skill Overlap (30%)
        int skillScore = calculateSkillScore(student, job, result);

        // 2. Schedule & Lecture Conflict (25%)
        int scheduleScore = calculateScheduleScore(student, job, studentTimetable, result);

        // 3. Location Proximity (15%)
        int locationScore = calculateLocationScore(student, job, result);

        // 4. Job Category Match (10%)
        int categoryScore = calculateCategoryScore(student, job, result);

        // 5. Work Type Preference (10%)
        int workTypeScore = calculateWorkTypeScore(student, job, result);

        // 6. Salary Expectation (10%)
        int salaryScore = calculateSalaryScore(student, job, result);

        // Composite calculation
        int totalScore = (int) Math.round(
                (skillScore * 0.30) +
                (scheduleScore * 0.25) +
                (locationScore * 0.15) +
                (categoryScore * 0.10) +
                (workTypeScore * 0.10) +
                (salaryScore * 0.10)
        );

        // Hard cap if timetable conflict exists
        if (result.isHasTimetableConflict()) {
            totalScore = Math.min(totalScore, 45); // Penalize max score to 45% if conflict exists
        }

        result.setOverallScore(Math.max(0, Math.min(100, totalScore)));
        result.setSkillScore(skillScore);
        result.setScheduleScore(scheduleScore);
        result.setLocationScore(locationScore);
        result.setCategoryScore(categoryScore);
        result.setWorkTypeScore(workTypeScore);
        result.setSalaryScore(salaryScore);

        return result;
    }

    private int calculateSkillScore(StudentProfile student, Job job, MatchResult result) {
        List<Skill> reqSkills = job.getRequiredSkills();
        if (reqSkills == null || reqSkills.isEmpty()) {
            result.addReason("✓ General position requiring standard student capabilities");
            return 80;
        }

        List<Skill> studentSkills = student.getSkills() != null ? student.getSkills() : Collections.emptyList();
        Set<String> studentSkillNames = new HashSet<>();
        for (Skill s : studentSkills) {
            studentSkillNames.add(s.getSkillName().toLowerCase());
        }

        int matchedCount = 0;
        List<String> matchedSkillNames = new ArrayList<>();
        for (Skill req : reqSkills) {
            if (studentSkillNames.contains(req.getSkillName().toLowerCase())) {
                matchedCount++;
                matchedSkillNames.add(req.getSkillName());
            }
        }

        if (matchedCount > 0) {
            result.addReason("✓ Matches your " + String.join(", ", matchedSkillNames) + " skill(s)");
            double ratio = (double) matchedCount / reqSkills.size();
            return (int) Math.round(ratio * 100);
        } else {
            return 20;
        }
    }

    private int calculateScheduleScore(StudentProfile student, Job job, List<TimetableEntry> timetable, MatchResult result) {
        if (job.getWorkingDays() == null || job.getStartTime() == null || job.getEndTime() == null) {
            return 70;
        }

        List<String> conflicts = timetableService.findScheduleConflicts(
                student.getId(), job.getWorkingDays(), job.getStartTime(), job.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            for (String conflict : conflicts) {
                result.addConflict("⚠ " + conflict);
            }
            return 0;
        } else {
            result.addReason("✓ Fits your weekly lecture schedule without conflict (" + job.getWorkingDays() + ")");
            return 100;
        }
    }

    private int calculateLocationScore(StudentProfile student, Job job, MatchResult result) {
        if (student.getPreferredLocation() == null || job.getLocation() == null) {
            return 70;
        }

        String studLoc = student.getPreferredLocation().trim().toLowerCase();
        String jobLoc = job.getLocation().trim().toLowerCase();

        if (job.getWorkType() != null && job.getWorkType().name().equals("REMOTE")) {
            result.addReason("✓ Remote position accessible from anywhere");
            return 100;
        }

        if (studLoc.contains(jobLoc) || jobLoc.contains(studLoc)) {
            result.addReason("✓ Near your preferred location (" + job.getLocation() + ")");
            return 100;
        } else {
            return 40;
        }
    }

    private int calculateCategoryScore(StudentProfile student, Job job, MatchResult result) {
        if (student.getDepartment() != null && job.getCategoryName() != null) {
            String dept = student.getDepartment().toLowerCase();
            String cat = job.getCategoryName().toLowerCase();
            if ((dept.contains("cs") || dept.contains("computer") || dept.contains("it")) && (cat.contains("software") || cat.contains("it"))) {
                result.addReason("✓ Strongly aligned with your " + student.getDepartment() + " department");
                return 100;
            }
            if ((dept.contains("commerce") || dept.contains("finance")) && (cat.contains("office") || cat.contains("admin"))) {
                result.addReason("✓ Aligned with your Commerce background");
                return 100;
            }
        }
        return 70;
    }

    private int calculateWorkTypeScore(StudentProfile student, Job job, MatchResult result) {
        if (student.getPreferredWorkType() == null || job.getWorkType() == null) {
            return 80;
        }
        if (student.getPreferredWorkType() == job.getWorkType()) {
            result.addReason("✓ Matches your preferred work mode (" + job.getWorkType() + ")");
            return 100;
        }
        return 60;
    }

    private int calculateSalaryScore(StudentProfile student, Job job, MatchResult result) {
        if (student.getTargetHourlyRate() == null || job.getSalaryAmount() == null) {
            return 80;
        }

        BigDecimal salary = job.getSalaryAmount();
        if (salary.compareTo(BigDecimal.valueOf(300)) >= 0) {
            result.addReason("✓ Pay rate matches or exceeds your target expectations");
            return 100;
        }
        return 75;
    }
}
