package com.campusflex.dao;

import com.campusflex.model.Application;
import com.campusflex.model.enums.ApplicationStatus;

import java.util.List;
import java.util.Optional;

public interface ApplicationDAO {
    Application apply(Application application);
    Optional<Application> findById(Long id);
    Optional<Application> findByStudentAndJob(Long studentId, Long jobId);
    List<Application> findByStudentId(Long studentId, ApplicationStatus statusFilter);
    List<Application> findByJobId(Long jobId, ApplicationStatus statusFilter);
    List<Application> findByEmployerId(Long employerId);
    boolean updateStatus(Long applicationId, ApplicationStatus status);
    boolean existsByStudentAndJob(Long studentId, Long jobId);
    int countAcceptedByStudent(Long studentId);
}
