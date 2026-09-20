package com.campusflex;

import com.campusflex.model.Job;
import com.campusflex.model.MatchResult;
import com.campusflex.model.Skill;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.DayOfWeek;
import com.campusflex.service.MatchingService;
import com.campusflex.service.TimetableService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

class MatchingServiceTest {

    private TimetableService timetableService;
    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        timetableService = Mockito.mock(TimetableService.class);
        matchingService = new MatchingService(timetableService);
    }

    @Test
    void testMatchingServiceNoConflictHighScore() {
        StudentProfile student = new StudentProfile(1L, 1L, "Ananya Verma", "NIT Calicut", "Computer Science", 5);
        List<Skill> studentSkills = new ArrayList<>();
        studentSkills.add(new Skill(1L, "Java", "IT"));
        student.setSkills(studentSkills);
        student.setPreferredLocation("Calicut");

        Job job = new Job();
        job.setId(1L);
        job.setTitle("Java TA");
        job.setLocation("Calicut");
        job.setSalaryAmount(BigDecimal.valueOf(600));
        job.setWorkingDays("MONDAY,WEDNESDAY");
        job.setStartTime(LocalTime.of(17, 0));
        job.setEndTime(LocalTime.of(19, 0));

        List<Skill> reqSkills = new ArrayList<>();
        reqSkills.add(new Skill(1L, "Java", "IT"));
        job.setRequiredSkills(reqSkills);

        Mockito.when(timetableService.findScheduleConflicts(any(), any(), any(), any()))
                .thenReturn(new ArrayList<>());

        MatchResult result = matchingService.calculateMatch(student, job, new ArrayList<>());

        assertNotNull(result);
        assertFalse(result.isHasTimetableConflict());
        assertTrue(result.getOverallScore() >= 80);
        assertTrue(result.getMatchReasons().stream().anyMatch(r -> r.contains("Java")));
    }

    @Test
    void testMatchingServiceWithTimetableConflictPenalty() {
        StudentProfile student = new StudentProfile(1L, 1L, "Ananya Verma", "NIT Calicut", "Computer Science", 5);

        Job job = new Job();
        job.setId(2L);
        job.setTitle("Online Tutor");
        job.setWorkingDays("MONDAY");
        job.setStartTime(LocalTime.of(10, 0));
        job.setEndTime(LocalTime.of(12, 0));

        List<String> conflicts = new ArrayList<>();
        conflicts.add("Schedule conflict on MONDAY (09:00 - 12:00) with lecture 'Data Structures'");

        Mockito.when(timetableService.findScheduleConflicts(any(), any(), any(), any()))
                .thenReturn(conflicts);

        MatchResult result = matchingService.calculateMatch(student, job, new ArrayList<>());

        assertTrue(result.isHasTimetableConflict());
        assertTrue(result.getOverallScore() <= 45);
        assertTrue(result.getConflicts().stream().anyMatch(c -> c.contains("Data Structures")));
    }
}
