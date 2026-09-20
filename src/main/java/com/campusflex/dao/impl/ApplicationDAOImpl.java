package com.campusflex.dao.impl;

import com.campusflex.dao.ApplicationDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Application;
import com.campusflex.model.enums.ApplicationStatus;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ApplicationDAOImpl implements ApplicationDAO {

    private final DataSource dataSource;

    public ApplicationDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Application apply(Application application) {
        String sql = "INSERT INTO applications (student_id, job_id, status, cover_note) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, application.getStudentId());
            pstmt.setLong(2, application.getJobId());
            pstmt.setString(3, application.getStatus() != null ? application.getStatus().name() : "PENDING");
            pstmt.setString(4, application.getCoverNote());

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    application.setId(rs.getLong(1));
                }
            }
            return application;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating job application: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Application> findById(Long id) {
        String sql = "SELECT a.*, sp.full_name as student_name, u.email as student_email, sp.college as student_college, sp.department as student_department, sp.profile_photo as student_photo, j.title as job_title, ep.company_name " +
                "FROM applications a " +
                "JOIN student_profiles sp ON a.student_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE a.id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToApplication(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding application by ID: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Application> findByStudentAndJob(Long studentId, Long jobId) {
        String sql = "SELECT a.*, sp.full_name as student_name, u.email as student_email, sp.college as student_college, sp.department as student_department, sp.profile_photo as student_photo, j.title as job_title, ep.company_name " +
                "FROM applications a " +
                "JOIN student_profiles sp ON a.student_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE a.student_id = ? AND a.job_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, jobId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToApplication(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding application by student and job: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public List<Application> findByStudentId(Long studentId, ApplicationStatus statusFilter) {
        StringBuilder sql = new StringBuilder(
                "SELECT a.*, sp.full_name as student_name, u.email as student_email, sp.college as student_college, sp.department as student_department, sp.profile_photo as student_photo, j.title as job_title, ep.company_name " +
                "FROM applications a " +
                "JOIN student_profiles sp ON a.student_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE a.student_id = ? "
        );

        if (statusFilter != null) {
            sql.append("AND a.status = ? ");
        }
        sql.append("ORDER BY a.applied_at DESC");

        List<Application> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            pstmt.setLong(1, studentId);
            if (statusFilter != null) {
                pstmt.setString(2, statusFilter.name());
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToApplication(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding applications by student ID: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<Application> findByJobId(Long jobId, ApplicationStatus statusFilter) {
        StringBuilder sql = new StringBuilder(
                "SELECT a.*, sp.full_name as student_name, u.email as student_email, sp.college as student_college, sp.department as student_department, sp.profile_photo as student_photo, j.title as job_title, ep.company_name " +
                "FROM applications a " +
                "JOIN student_profiles sp ON a.student_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE a.job_id = ? "
        );

        if (statusFilter != null) {
            sql.append("AND a.status = ? ");
        }
        sql.append("ORDER BY a.applied_at DESC");

        List<Application> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            pstmt.setLong(1, jobId);
            if (statusFilter != null) {
                pstmt.setString(2, statusFilter.name());
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToApplication(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding applications by job ID: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<Application> findByEmployerId(Long employerId) {
        String sql = "SELECT a.*, sp.full_name as student_name, u.email as student_email, sp.college as student_college, sp.department as student_department, sp.profile_photo as student_photo, j.title as job_title, ep.company_name " +
                "FROM applications a " +
                "JOIN student_profiles sp ON a.student_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE j.employer_id = ? ORDER BY a.applied_at DESC";
        List<Application> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, employerId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToApplication(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding applications by employer ID: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean updateStatus(Long applicationId, ApplicationStatus status) {
        String sql = "UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            pstmt.setLong(2, applicationId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating application status: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsByStudentAndJob(Long studentId, Long jobId) {
        String sql = "SELECT COUNT(*) FROM applications WHERE student_id = ? AND job_id = ?";
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
            throw new DatabaseException("Error checking application existence: " + e.getMessage(), e);
        }
        return false;
    }

    @Override
    public int countAcceptedByStudent(Long studentId) {
        String sql = "SELECT COUNT(*) FROM applications WHERE student_id = ? AND status = 'ACCEPTED'";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error counting accepted applications: " + e.getMessage(), e);
        }
        return 0;
    }

    private Application mapResultSetToApplication(ResultSet rs) throws SQLException {
        Application app = new Application();
        app.setId(rs.getLong("id"));
        app.setStudentId(rs.getLong("student_id"));
        app.setStudentName(rs.getString("student_name"));
        app.setStudentEmail(rs.getString("student_email"));
        app.setStudentCollege(rs.getString("student_college"));
        app.setStudentDepartment(rs.getString("student_department"));
        app.setStudentPhoto(rs.getString("student_photo"));
        app.setJobId(rs.getLong("job_id"));
        app.setJobTitle(rs.getString("job_title"));
        app.setCompanyName(rs.getString("company_name"));
        String status = rs.getString("status");
        if (status != null) app.setStatus(ApplicationStatus.valueOf(status));
        app.setCoverNote(rs.getString("cover_note"));
        Timestamp applied = rs.getTimestamp("applied_at");
        if (applied != null) app.setAppliedAt(applied.toLocalDateTime());
        Timestamp updated = rs.getTimestamp("updated_at");
        if (updated != null) app.setUpdatedAt(updated.toLocalDateTime());
        return app;
    }
}
