package com.campusflex.controller;

import com.campusflex.dao.EmployerDAO;
import com.campusflex.exception.AuthenticationException;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.Job;
import com.campusflex.model.MatchResult;
import com.campusflex.model.Report;
import com.campusflex.model.User;
import com.campusflex.model.enums.SalaryType;
import com.campusflex.model.enums.WorkType;
import com.campusflex.service.JobService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final EmployerDAO employerDAO;

    public JobController(JobService jobService, EmployerDAO employerDAO) {
        this.jobService = jobService;
        this.employerDAO = employerDAO;
    }

    @GetMapping
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workType,
            @RequestParam(required = false, defaultValue = "false") Boolean verifiedOnly,
            @RequestParam(required = false, defaultValue = "20") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset) {

        WorkType wt = null;
        if (workType != null && !workType.trim().isEmpty()) {
            try { wt = WorkType.valueOf(workType.toUpperCase()); } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(jobService.searchJobs(keyword, categoryId, location, wt, verifiedOnly, limit, offset));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Map<String, Object> body, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getRole().name().equals("EMPLOYER")) {
            throw new AuthenticationException("Only registered employers can post job vacancies.");
        }

        EmployerProfile emp = employerDAO.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        Job job = new Job();
        job.setEmployerId(emp.getId());
        job.setTitle((String) body.get("title"));
        job.setCategoryId(Long.parseLong(body.get("categoryId").toString()));
        job.setDescription((String) body.get("description"));
        job.setRequirements((String) body.get("requirements"));
        job.setSalaryAmount(new BigDecimal(body.get("salaryAmount").toString()));
        if (body.containsKey("salaryType") && body.get("salaryType") != null) {
            job.setSalaryType(SalaryType.valueOf(body.get("salaryType").toString()));
        }
        job.setLocation((String) body.get("location"));
        if (body.containsKey("workType") && body.get("workType") != null) {
            job.setWorkType(WorkType.valueOf(body.get("workType").toString()));
        }
        job.setStartTime(LocalTime.parse(body.get("startTime").toString()));
        job.setEndTime(LocalTime.parse(body.get("endTime").toString()));
        job.setWorkingDays((String) body.get("workingDays"));
        if (body.containsKey("vacancies") && body.get("vacancies") != null) {
            job.setVacancies(Integer.parseInt(body.get("vacancies").toString()));
        }
        if (body.containsKey("deadline") && body.get("deadline") != null) {
            job.setDeadline(LocalDate.parse(body.get("deadline").toString()));
        } else {
            job.setDeadline(LocalDate.now().plusDays(30));
        }

        Job created = jobService.createJob(job);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<Job>> getJobsByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(employerId));
    }

    @GetMapping("/{id}/match")
    public ResponseEntity<MatchResult> getJobMatch(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to view match score.");
        }
        return ResponseEntity.ok(jobService.getMatchForStudent(user.getId(), id));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Map<String, Object>> reportJob(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to report a job.");
        }

        String reason = body.get("reason");
        String details = body.get("details");

        Report report = jobService.reportJob(user.getId(), id, reason, details);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Report submitted. Our moderation team will investigate.");
        res.put("report", report);
        return ResponseEntity.ok(res);
    }
}
