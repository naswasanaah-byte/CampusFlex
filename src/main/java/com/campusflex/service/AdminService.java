package com.campusflex.service;

import com.campusflex.dao.*;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.Notification;
import com.campusflex.model.Report;
import com.campusflex.model.enums.JobStatus;
import com.campusflex.model.enums.ReportStatus;
import com.campusflex.model.enums.VerificationStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserDAO userDAO;
    private final EmployerDAO employerDAO;
    private final StudentDAO studentDAO;
    private final JobDAO jobDAO;
    private final ApplicationDAO applicationDAO;
    private final ReportDAO reportDAO;
    private final NotificationDAO notificationDAO;

    public AdminService(UserDAO userDAO, EmployerDAO employerDAO, StudentDAO studentDAO, JobDAO jobDAO, ApplicationDAO applicationDAO, ReportDAO reportDAO, NotificationDAO notificationDAO) {
        this.userDAO = userDAO;
        this.employerDAO = employerDAO;
        this.studentDAO = studentDAO;
        this.jobDAO = jobDAO;
        this.applicationDAO = applicationDAO;
        this.reportDAO = reportDAO;
        this.notificationDAO = notificationDAO;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userDAO.findAll().size());
        stats.put("totalEmployers", employerDAO.findAll().size());
        stats.put("totalJobs", jobDAO.findAllActiveJobs().size());
        stats.put("pendingVerifications", employerDAO.findByVerificationStatus(VerificationStatus.PENDING).size());
        stats.put("pendingReports", reportDAO.findByStatus(ReportStatus.PENDING).size());
        return stats;
    }

    public List<EmployerProfile> getPendingEmployerVerifications() {
        return employerDAO.findByVerificationStatus(VerificationStatus.PENDING);
    }

    public boolean verifyEmployer(Long employerId, boolean approve) {
        EmployerProfile profile = employerDAO.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found."));

        VerificationStatus newStatus = approve ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
        boolean updated = employerDAO.updateVerificationStatus(employerId, newStatus);

        if (updated) {
            String title = approve ? "Employer Verification Approved! ✓" : "Employer Verification Update";
            String msg = approve ? "Your company profile has been verified. Your job postings now display the Verified badge." : "Your verification request was rejected. Please update your details.";
            notificationDAO.create(new Notification(null, profile.getUserId(), title, msg, "VERIFICATION"));
        }
        return updated;
    }

    public List<Report> getAllReports() {
        return reportDAO.findAll();
    }

    public boolean resolveReport(Long reportId, boolean removeJob) {
        Report report = reportDAO.findAll().stream()
                .filter(r -> r.getId().equals(reportId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (removeJob && report.getJobId() != null) {
            jobDAO.updateStatus(report.getJobId(), JobStatus.EXPIRED);
        }

        return reportDAO.updateStatus(reportId, ReportStatus.RESOLVED);
    }
}
