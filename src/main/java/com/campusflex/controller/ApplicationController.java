package com.campusflex.controller;

import com.campusflex.dao.EmployerDAO;
import com.campusflex.exception.AuthenticationException;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.model.Application;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.User;
import com.campusflex.model.enums.ApplicationStatus;
import com.campusflex.service.ApplicationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final EmployerDAO employerDAO;

    public ApplicationController(ApplicationService applicationService, EmployerDAO employerDAO) {
        this.applicationService = applicationService;
        this.employerDAO = employerDAO;
    }

    private User getAuthenticatedUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to perform this action.");
        }
        return user;
    }

    @PostMapping("/apply")
    public ResponseEntity<Application> applyForJob(@RequestBody Map<String, Object> body, HttpSession session) {
        User user = getAuthenticatedUser(session);
        Long jobId = Long.parseLong(body.get("jobId").toString());
        String coverNote = (String) body.get("coverNote");

        Application app = applicationService.applyForJob(user.getId(), jobId, coverNote);
        return ResponseEntity.ok(app);
    }

    @GetMapping("/student")
    public ResponseEntity<List<Application>> getStudentApplications(
            @RequestParam(required = false) String status,
            HttpSession session) {

        User user = getAuthenticatedUser(session);
        ApplicationStatus st = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try { st = ApplicationStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(applicationService.getStudentApplications(user.getId(), st));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplicants(
            @PathVariable Long jobId,
            @RequestParam(required = false) String status) {

        ApplicationStatus st = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try { st = ApplicationStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, st));
    }

    @GetMapping("/employer")
    public ResponseEntity<List<Application>> getEmployerApplicants(HttpSession session) {
        User user = getAuthenticatedUser(session);
        EmployerProfile emp = employerDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        return ResponseEntity.ok(applicationService.getEmployerApplicants(emp.getId()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Map<String, String>> acceptApplicant(@PathVariable Long id, HttpSession session) {
        User user = getAuthenticatedUser(session);
        applicationService.acceptApplicant(id, user.getId());

        Map<String, String> res = new HashMap<>();
        res.put("message", "Applicant accepted successfully!");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectApplicant(@PathVariable Long id, HttpSession session) {
        getAuthenticatedUser(session);
        applicationService.rejectApplicant(id);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Applicant marked as rejected.");
        return ResponseEntity.ok(res);
    }
}
