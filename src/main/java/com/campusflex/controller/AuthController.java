package com.campusflex.controller;

import com.campusflex.model.EmployerUser;
import com.campusflex.model.StudentUser;
import com.campusflex.model.User;
import com.campusflex.service.AuthenticationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authService;

    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body, HttpSession session) {
        String email = body.get("email");
        String password = body.get("password");

        User user = authService.login(email, password);
        session.setAttribute("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", user);
        response.put("role", user.getRole().name());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/student")
    public ResponseEntity<Map<String, Object>> registerStudent(@RequestBody Map<String, Object> body, HttpSession session) {
        String email = (String) body.get("email");
        String phone = (String) body.get("phone");
        String password = (String) body.get("password");
        String fullName = (String) body.get("fullName");
        String college = (String) body.get("college");
        String department = (String) body.get("department");
        Integer semester = body.get("semester") != null ? Integer.parseInt(body.get("semester").toString()) : 1;

        StudentUser user = authService.registerStudent(email, phone, password, fullName, college, department, semester);
        session.setAttribute("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Student registration successful");
        response.put("user", user);
        response.put("role", user.getRole().name());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/employer")
    public ResponseEntity<Map<String, Object>> registerEmployer(@RequestBody Map<String, String> body, HttpSession session) {
        String email = body.get("email");
        String phone = body.get("phone");
        String password = body.get("password");
        String companyName = body.get("companyName");
        String location = body.get("location");
        String industry = body.get("industry");

        EmployerUser user = authService.registerEmployer(email, phone, password, companyName, location, industry);
        session.setAttribute("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Employer registration successful");
        response.put("user", user);
        response.put("role", user.getRole().name());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            Map<String, Object> res = new HashMap<>();
            res.put("authenticated", false);
            return ResponseEntity.ok(res);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("authenticated", true);
        res.put("user", user);
        res.put("role", user.getRole().name());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        Map<String, String> res = new HashMap<>();
        res.put("message", "Logged out successfully");
        return ResponseEntity.ok(res);
    }
}
