package com.campusflex.controller;

import com.campusflex.dao.ApplicationDAO;
import com.campusflex.dao.SavedJobDAO;
import com.campusflex.dao.StudentDAO;
import com.campusflex.exception.AuthenticationException;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.model.Job;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.StudentUser;
import com.campusflex.model.TimetableEntry;
import com.campusflex.model.User;
import com.campusflex.model.enums.DayOfWeek;
import com.campusflex.model.enums.WorkType;
import com.campusflex.service.TimetableService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentDAO studentDAO;
    private final TimetableService timetableService;
    private final SavedJobDAO savedJobDAO;
    private final ApplicationDAO applicationDAO;

    public StudentController(StudentDAO studentDAO, TimetableService timetableService, SavedJobDAO savedJobDAO, ApplicationDAO applicationDAO) {
        this.studentDAO = studentDAO;
        this.timetableService = timetableService;
        this.savedJobDAO = savedJobDAO;
        this.applicationDAO = applicationDAO;
    }

    private User getAuthenticatedUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to continue.");
        }
        return user;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Map<String, Object> res = new HashMap<>();
        res.put("profile", profile);
        res.put("completionPercentage", profile.calculateCompletionPercentage());
        res.put("missingFields", profile.getMissingFields());
        res.put("availableSkills", studentDAO.getAllAvailableSkills());

        return ResponseEntity.ok(res);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> body, HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (body.containsKey("fullName")) profile.setFullName((String) body.get("fullName"));
        if (body.containsKey("college")) profile.setCollege((String) body.get("college"));
        if (body.containsKey("department")) profile.setDepartment((String) body.get("department"));
        if (body.containsKey("semester") && body.get("semester") != null) profile.setSemester(Integer.parseInt(body.get("semester").toString()));
        if (body.containsKey("bio")) profile.setBio((String) body.get("bio"));
        if (body.containsKey("profilePhoto")) profile.setProfilePhoto((String) body.get("profilePhoto"));
        if (body.containsKey("preferredLocation")) profile.setPreferredLocation((String) body.get("preferredLocation"));
        if (body.containsKey("preferredWorkType") && body.get("preferredWorkType") != null) {
            profile.setPreferredWorkType(WorkType.valueOf(body.get("preferredWorkType").toString()));
        }
        if (body.containsKey("targetHourlyRate") && body.get("targetHourlyRate") != null) {
            profile.setTargetHourlyRate(new BigDecimal(body.get("targetHourlyRate").toString()));
        }

        studentDAO.updateProfile(profile);

        if (body.containsKey("skillIds") && body.get("skillIds") instanceof List<?> ids) {
            List<Long> skillIds = ids.stream().map(o -> Long.parseLong(o.toString())).toList();
            studentDAO.updateSkills(profile.getId(), skillIds);
            profile.setSkills(studentDAO.getStudentSkills(profile.getId()));
        }

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Profile updated successfully!");
        res.put("profile", profile);
        res.put("completionPercentage", profile.calculateCompletionPercentage());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<TimetableEntry>> getTimetable(HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return ResponseEntity.ok(timetableService.getStudentTimetable(profile.getId()));
    }

    @PostMapping("/timetable")
    public ResponseEntity<TimetableEntry> addLecture(@RequestBody Map<String, String> body, HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        DayOfWeek day = DayOfWeek.valueOf(body.get("dayOfWeek").toUpperCase());
        LocalTime start = LocalTime.parse(body.get("startTime"));
        LocalTime end = LocalTime.parse(body.get("endTime"));
        String subject = body.get("subjectName");
        String type = body.get("type") != null ? body.get("type") : "Lecture";

        TimetableEntry entry = timetableService.addLecture(profile.getId(), day, start, end, subject, type);
        return ResponseEntity.ok(entry);
    }

    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<Map<String, String>> deleteLecture(@PathVariable Long id, HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        timetableService.deleteLecture(id, profile.getId());
        Map<String, String> res = new HashMap<>();
        res.put("message", "Lecture deleted successfully.");
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/timetable/clear")
    public ResponseEntity<Map<String, String>> clearTimetable(HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        timetableService.clearTimetable(profile.getId());
        Map<String, String> res = new HashMap<>();
        res.put("message", "Timetable cleared successfully.");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<List<Job>> getSavedJobs(HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return ResponseEntity.ok(savedJobDAO.getSavedJobs(profile.getId()));
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, String>> saveJob(@PathVariable Long jobId, HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        savedJobDAO.saveJob(profile.getId(), jobId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Job saved successfully.");
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, String>> removeSavedJob(@PathVariable Long jobId, HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        savedJobDAO.removeSavedJob(profile.getId(), jobId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Job removed from saved list.");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/earnings")
    public ResponseEntity<Map<String, Object>> getEarnings(HttpSession session) {
        User user = getAuthenticatedUser(session);
        StudentProfile profile = studentDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        int acceptedJobs = applicationDAO.countAcceptedByStudent(profile.getId());
        BigDecimal estimatedTotal = BigDecimal.valueOf(acceptedJobs * 600L); // Sample daily rate calc

        Map<String, Object> res = new HashMap<>();
        res.put("totalEarnings", estimatedTotal);
        res.put("completedJobs", acceptedJobs);
        res.put("currency", "₹");
        return ResponseEntity.ok(res);
    }
}
