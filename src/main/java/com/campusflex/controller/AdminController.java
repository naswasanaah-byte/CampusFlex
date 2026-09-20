package com.campusflex.controller;

import com.campusflex.exception.AuthenticationException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.Report;
import com.campusflex.model.User;
import com.campusflex.service.AdminService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    private void verifyAdminRole(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getRole().name().equals("ADMIN")) {
            throw new AuthenticationException("Access restricted. Admin authorization required.");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(HttpSession session) {
        verifyAdminRole(session);
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/verifications")
    public ResponseEntity<List<EmployerProfile>> getPendingVerifications(HttpSession session) {
        verifyAdminRole(session);
        return ResponseEntity.ok(adminService.getPendingEmployerVerifications());
    }

    @PutMapping("/verifications/{employerId}/approve")
    public ResponseEntity<Map<String, String>> approveEmployer(@PathVariable Long employerId, HttpSession session) {
        verifyAdminRole(session);
        adminService.verifyEmployer(employerId, true);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Employer verification approved!");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/verifications/{employerId}/reject")
    public ResponseEntity<Map<String, String>> rejectEmployer(@PathVariable Long employerId, HttpSession session) {
        verifyAdminRole(session);
        adminService.verifyEmployer(employerId, false);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Employer verification rejected.");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports(HttpSession session) {
        verifyAdminRole(session);
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PutMapping("/reports/{reportId}/resolve")
    public ResponseEntity<Map<String, String>> resolveReport(
            @PathVariable Long reportId,
            @RequestParam(required = false, defaultValue = "false") Boolean removeJob,
            HttpSession session) {

        verifyAdminRole(session);
        adminService.resolveReport(reportId, removeJob);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Report resolved.");
        return ResponseEntity.ok(res);
    }
}
