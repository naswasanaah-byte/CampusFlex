package com.campusflex.service;

import com.campusflex.dao.ApplicationDAO;
import com.campusflex.dao.JobDAO;
import com.campusflex.dao.NotificationDAO;
import com.campusflex.dao.StudentDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.Application;
import com.campusflex.model.Job;
import com.campusflex.model.Notification;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.enums.ApplicationStatus;
import com.campusflex.model.enums.JobStatus;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationDAO applicationDAO;
    private final JobDAO jobDAO;
    private final StudentDAO studentDAO;
    private final NotificationDAO notificationDAO;
    private final DataSource dataSource;

    public ApplicationService(ApplicationDAO applicationDAO, JobDAO jobDAO, StudentDAO studentDAO, NotificationDAO notificationDAO, DataSource dataSource) {
        this.applicationDAO = applicationDAO;
        this.jobDAO = jobDAO;
        this.studentDAO = studentDAO;
        this.notificationDAO = notificationDAO;
        this.dataSource = dataSource;
    }

    public Application applyForJob(Long studentUserId, Long jobId, String coverNote) {
        StudentProfile student = studentDAO.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found."));

        Job job = jobDAO.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found."));

        if (job.getStatus() != JobStatus.ACTIVE || job.isExpired()) {
            throw new ValidationException("This job is no longer accepting applications.");
        }

        if (job.getVacancies() <= 0) {
            throw new ValidationException("This job vacancy has already been filled.");
        }

        if (applicationDAO.existsByStudentAndJob(student.getId(), jobId)) {
            throw new ValidationException("You have already applied for this job.");
        }

        Application application = new Application();
        application.setStudentId(student.getId());
        application.setJobId(jobId);
        application.setCoverNote(coverNote);
        application.setStatus(ApplicationStatus.PENDING);

        Application created = applicationDAO.apply(application);

        // Send notification to Employer
        notificationDAO.create(new Notification(null, job.getEmployerId(), "New Applicant",
                "A student applied for your posting: " + job.getTitle(), "APPLICATION"));

        return created;
    }

    public List<Application> getStudentApplications(Long studentUserId, ApplicationStatus statusFilter) {
        StudentProfile student = studentDAO.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found."));
        return applicationDAO.findByStudentId(student.getId(), statusFilter);
    }

    public List<Application> getJobApplicants(Long jobId, ApplicationStatus statusFilter) {
        return applicationDAO.findByJobId(jobId, statusFilter);
    }

    public List<Application> getEmployerApplicants(Long employerId) {
        return applicationDAO.findByEmployerId(employerId);
    }

    /**
     * Accept applicant using an EXPLICIT JDBC TRANSACTION:
     * 1. conn.setAutoCommit(false)
     * 2. Update application status to ACCEPTED
     * 3. Decrement job vacancies
     * 4. If vacancies reach 0, mark job FILLED
     * 5. Create notification for student
     * 6. Commit transaction
     */
    public boolean acceptApplicant(Long applicationId, Long employerUserId) {
        Application app = applicationDAO.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found."));

        Job job = jobDAO.findById(app.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));

        if (job.getVacancies() <= 0) {
            throw new ValidationException("Cannot accept applicant. All vacancies for this job are filled.");
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // 1. Update application status
                applicationDAO.updateStatus(applicationId, ApplicationStatus.ACCEPTED);

                // 2. Decrement vacancy
                jobDAO.decrementVacancies(conn, job.getId());

                // 3. Re-fetch job to check remaining vacancies
                Job updatedJob = jobDAO.findById(job.getId()).orElse(job);
                if (updatedJob.getVacancies() <= 0) {
                    jobDAO.updateStatus(job.getId(), JobStatus.FILLED);
                }

                // 4. Create Notification for Student
                StudentProfile student = studentDAO.findById(app.getStudentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
                
                notificationDAO.create(new Notification(null, student.getUserId(), "Application Accepted! 🎉",
                        "Congratulations! Your application for '" + job.getTitle() + "' was accepted.", "APPLICATION"));

                conn.commit();
                return true;
            } catch (Exception ex) {
                conn.rollback();
                throw new DatabaseException("Transaction failed while accepting applicant: " + ex.getMessage(), ex);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error managing transaction connection: " + e.getMessage(), e);
        }
    }

    public boolean rejectApplicant(Long applicationId) {
        Application app = applicationDAO.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found."));
        
        boolean updated = applicationDAO.updateStatus(applicationId, ApplicationStatus.REJECTED);
        if (updated) {
            StudentProfile student = studentDAO.findById(app.getStudentId()).orElse(null);
            if (student != null) {
                notificationDAO.create(new Notification(null, student.getUserId(), "Application Update",
                        "Your application for '" + app.getJobTitle() + "' was not selected.", "APPLICATION"));
            }
        }
        return updated;
    }
}
