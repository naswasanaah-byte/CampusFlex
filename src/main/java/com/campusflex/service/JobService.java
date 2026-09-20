package com.campusflex.service;

import com.campusflex.dao.EmployerDAO;
import com.campusflex.dao.JobDAO;
import com.campusflex.dao.ReportDAO;
import com.campusflex.dao.StudentDAO;
import com.campusflex.dao.TimetableDAO;
import com.campusflex.exception.ResourceNotFoundException;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.Job;
import com.campusflex.model.MatchResult;
import com.campusflex.model.Report;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.JobStatus;
import com.campusflex.model.enums.WorkType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobDAO jobDAO;
    private final EmployerDAO employerDAO;
    private final StudentDAO studentDAO;
    private final TimetableDAO timetableDAO;
    private final ReportDAO reportDAO;
    private final MatchingService matchingService;

    public JobService(JobDAO jobDAO, EmployerDAO employerDAO, StudentDAO studentDAO, TimetableDAO timetableDAO, ReportDAO reportDAO, MatchingService matchingService) {
        this.jobDAO = jobDAO;
        this.employerDAO = employerDAO;
        this.studentDAO = studentDAO;
        this.timetableDAO = timetableDAO;
        this.reportDAO = reportDAO;
        this.matchingService = matchingService;
    }

    public Job createJob(Job job) {
        validateJob(job);
        EmployerProfile emp = employerDAO.findById(job.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        job.setIsVerified(emp.isVerified());
        job.setStatus(JobStatus.ACTIVE);
        return jobDAO.create(job);
    }

    public Job getJobById(Long id) {
        return jobDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with ID: " + id));
    }

    public List<Job> searchJobs(String keyword, Long categoryId, String location, WorkType workType, Boolean verifiedOnly, int limit, int offset) {
        return jobDAO.searchJobs(keyword, categoryId, location, workType, verifiedOnly, limit, offset);
    }

    public List<Job> getJobsByEmployer(Long employerId) {
        return jobDAO.findByEmployerId(employerId);
    }

    public MatchResult getMatchForStudent(Long studentId, Long jobId) {
        StudentProfile student = studentDAO.findByUserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Job job = getJobById(jobId);
        List<TimetableEntry> timetable = timetableDAO.findByStudentId(student.getId());

        return matchingService.calculateMatch(student, job, timetable);
    }

    public Report reportJob(Long reporterUserId, Long jobId, String reason, String details) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new ValidationException("Report reason is required.");
        }
        Job job = getJobById(jobId);
        Report report = new Report();
        report.setReporterId(reporterUserId);
        report.setJobId(jobId);
        report.setReason(reason.trim());
        report.setDetails(details);
        return reportDAO.create(report);
    }

    private void validateJob(Job job) {
        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new ValidationException("Job title is required.");
        }
        if (job.getSalaryAmount() == null || job.getSalaryAmount().doubleValue() <= 0) {
            throw new ValidationException("Valid salary amount is required.");
        }
        if (job.getStartTime() == null || job.getEndTime() == null) {
            throw new ValidationException("Working hours (start time and end time) are required.");
        }
        if (job.getWorkingDays() == null || job.getWorkingDays().trim().isEmpty()) {
            throw new ValidationException("Working days are required.");
        }
    }
}
