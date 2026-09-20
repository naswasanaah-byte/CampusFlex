package com.campusflex.dao.impl;

import com.campusflex.dao.ReportDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Report;
import com.campusflex.model.enums.ReportStatus;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ReportDAOImpl implements ReportDAO {

    private final DataSource dataSource;

    public ReportDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Report create(Report report) {
        String sql = "INSERT INTO reports (reporter_id, job_id, reason, details, status) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, report.getReporterId());
            pstmt.setLong(2, report.getJobId());
            pstmt.setString(3, report.getReason());
            pstmt.setString(4, report.getDetails());
            pstmt.setString(5, report.getStatus() != null ? report.getStatus().name() : "PENDING");

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    report.setId(rs.getLong(1));
                }
            }
            return report;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating report: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Report> findAll() {
        String sql = "SELECT r.*, u.email as reporter_email, j.title as job_title, ep.company_name " +
                "FROM reports r " +
                "JOIN users u ON r.reporter_id = u.id " +
                "JOIN jobs j ON r.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "ORDER BY r.created_at DESC";
        List<Report> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                list.add(mapResultSetToReport(rs));
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching reports: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<Report> findByStatus(ReportStatus status) {
        String sql = "SELECT r.*, u.email as reporter_email, j.title as job_title, ep.company_name " +
                "FROM reports r " +
                "JOIN users u ON r.reporter_id = u.id " +
                "JOIN jobs j ON r.job_id = j.id " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "WHERE r.status = ? ORDER BY r.created_at DESC";
        List<Report> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToReport(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching reports by status: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean updateStatus(Long reportId, ReportStatus status) {
        String sql = "UPDATE reports SET status = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            pstmt.setLong(2, reportId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating report status: " + e.getMessage(), e);
        }
    }

    private Report mapResultSetToReport(ResultSet rs) throws SQLException {
        Report r = new Report();
        r.setId(rs.getLong("id"));
        r.setReporterId(rs.getLong("reporter_id"));
        r.setReporterEmail(rs.getString("reporter_email"));
        r.setJobId(rs.getLong("job_id"));
        r.setJobTitle(rs.getString("job_title"));
        r.setCompanyName(rs.getString("company_name"));
        r.setReason(rs.getString("reason"));
        r.setDetails(rs.getString("details"));
        String s = rs.getString("status");
        if (s != null) r.setStatus(ReportStatus.valueOf(s));
        Timestamp c = rs.getTimestamp("created_at");
        if (c != null) r.setCreatedAt(c.toLocalDateTime());
        return r;
    }
}
