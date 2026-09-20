package com.campusflex.dao;

import com.campusflex.model.Job;
import com.campusflex.model.Skill;
import com.campusflex.model.enums.JobStatus;
import com.campusflex.model.enums.WorkType;

import java.sql.Connection;
import java.util.List;
import java.util.Optional;

public interface JobDAO {
    Job create(Job job);
    Optional<Job> findById(Long id);
    List<Job> searchJobs(String keyword, Long categoryId, String location, WorkType workType, Boolean verifiedOnly, int limit, int offset);
    List<Job> findByEmployerId(Long employerId);
    List<Job> findAllActiveJobs();
    boolean update(Job job);
    boolean updateStatus(Long jobId, JobStatus status);
    boolean decrementVacancies(Connection conn, Long jobId);
    boolean delete(Long id);
    
    List<Skill> getJobSkills(Long jobId);
    void setJobSkills(Long jobId, List<Long> skillIds);
}
