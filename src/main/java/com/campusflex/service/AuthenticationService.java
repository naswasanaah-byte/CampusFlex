package com.campusflex.service;

import com.campusflex.dao.EmployerDAO;
import com.campusflex.dao.StudentDAO;
import com.campusflex.dao.UserDAO;
import com.campusflex.exception.AuthenticationException;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.EmployerUser;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.StudentUser;
import com.campusflex.model.User;
import com.campusflex.model.enums.UserRole;
import com.campusflex.security.PasswordUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserDAO userDAO;
    private final StudentDAO studentDAO;
    private final EmployerDAO employerDAO;

    public AuthenticationService(UserDAO userDAO, StudentDAO studentDAO, EmployerDAO employerDAO) {
        this.userDAO = userDAO;
        this.studentDAO = studentDAO;
        this.employerDAO = employerDAO;
    }

    public User login(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new ValidationException("Email and password are required.");
        }

        User user = userDAO.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new AuthenticationException("Incorrect email/phone or password."));

        if (!PasswordUtils.verifyPassword(password, user.getPasswordHash())) {
            throw new AuthenticationException("Incorrect email/phone or password.");
        }

        // Attach Profile based on Role
        if (user instanceof StudentUser studentUser) {
            studentDAO.findByUserId(studentUser.getId()).ifPresent(studentUser::setProfile);
        } else if (user instanceof EmployerUser employerUser) {
            employerDAO.findByUserId(employerUser.getId()).ifPresent(employerUser::setProfile);
        }

        return user;
    }

    public StudentUser registerStudent(String email, String phone, String password, String fullName, String college, String department, Integer semester) {
        validateEmailAndPhone(email, phone, password);

        if (fullName == null || fullName.trim().isEmpty()) {
            throw new ValidationException("Full name is required for student registration.");
        }

        String passwordHash = PasswordUtils.hashPassword(password);
        StudentUser user = new StudentUser(null, email.trim().toLowerCase(), phone, passwordHash, null);
        user = (StudentUser) userDAO.create(user);

        StudentProfile profile = new StudentProfile(null, user.getId(), fullName.trim(), college, department, semester);
        profile = studentDAO.createProfile(profile);
        user.setProfile(profile);

        return user;
    }

    public EmployerUser registerEmployer(String email, String phone, String password, String companyName, String location, String industry) {
        validateEmailAndPhone(email, phone, password);

        if (companyName == null || companyName.trim().isEmpty()) {
            throw new ValidationException("Company name is required for employer registration.");
        }

        String passwordHash = PasswordUtils.hashPassword(password);
        EmployerUser user = new EmployerUser(null, email.trim().toLowerCase(), phone, passwordHash, null);
        user = (EmployerUser) userDAO.create(user);

        EmployerProfile profile = new EmployerProfile(null, user.getId(), companyName.trim(), location);
        profile.setIndustry(industry);
        profile = employerDAO.createProfile(profile);
        user.setProfile(profile);

        return user;
    }

    private void validateEmailAndPhone(String email, String phone, String password) {
        if (email == null || !email.contains("@")) {
            throw new ValidationException("Valid email address is required.");
        }
        if (password == null || password.length() < 6) {
            throw new ValidationException("Password must be at least 6 characters long.");
        }
        if (userDAO.findByEmail(email.trim().toLowerCase()).isPresent()) {
            throw new ValidationException("An account with this email already exists.");
        }
    }
}
