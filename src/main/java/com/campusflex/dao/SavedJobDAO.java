package com.campusflex.dao;

import com.campusflex.model.Job;

import java.util.List;

public interface SavedJobDAO {
    boolean saveJob(Long studentId, Long jobId);
    boolean removeSavedJob(Long studentId, Long jobId);
    List<Job> getSavedJobs(Long studentId);
    boolean isJobSaved(Long studentId, Long jobId);
}
