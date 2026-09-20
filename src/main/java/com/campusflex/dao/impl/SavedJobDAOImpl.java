package com.campusflex.dao.impl;

import com.campusflex.dao.JobDAO;
import com.campusflex.dao.SavedJobDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Job;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class SavedJobDAOImpl implements SavedJobDAO {

    private final DataSource dataSource;
    private final JobDAO jobDAO;

    public SavedJobDAOImpl(DataSource dataSource, JobDAO jobDAO) {
        this.dataSource = dataSource;
        this.jobDAO = jobDAO;
    }

    @Override
    public boolean saveJob(Long studentId, Long jobId) {
        String sql = "INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, jobId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            // Ignore if already saved
            return false;
        }
    }

    @Override
    public boolean removeSavedJob(Long studentId, Long jobId) {
        String sql = "DELETE FROM saved_jobs WHERE student_id = ? AND job_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, jobId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error removing saved job: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Job> getSavedJobs(Long studentId) {
        String sql = "SELECT job_id FROM saved_jobs WHERE student_id = ? ORDER BY saved_at DESC";
        List<Job> jobs = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Long jobId = rs.getLong("job_id");
                    jobDAO.findById(jobId).ifPresent(jobs::add);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching saved jobs: " + e.getMessage(), e);
        }
        return jobs;
    }

    @Override
    public boolean isJobSaved(Long studentId, Long jobId) {
        String sql = "SELECT COUNT(*) FROM saved_jobs WHERE student_id = ? AND job_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, jobId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error checking saved job state: " + e.getMessage(), e);
        }
        return false;
    }
}
