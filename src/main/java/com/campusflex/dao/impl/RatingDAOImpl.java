package com.campusflex.dao.impl;

import com.campusflex.dao.RatingDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Rating;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RatingDAOImpl implements RatingDAO {

    private final DataSource dataSource;

    public RatingDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Rating create(Rating rating) {
        String sql = "INSERT INTO ratings (evaluator_id, evaluatee_id, job_id, rating, review_text) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, rating.getEvaluatorId());
            pstmt.setLong(2, rating.getEvaluateeId());
            pstmt.setLong(3, rating.getJobId());
            pstmt.setInt(4, rating.getRating());
            pstmt.setString(5, rating.getReviewText());

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    rating.setId(rs.getLong(1));
                }
            }
            return rating;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating rating: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Rating> findByEvaluateeId(Long evaluateeId) {
        String sql = "SELECT r.*, u1.email as evaluator_name, u2.email as evaluatee_name, j.title as job_title " +
                "FROM ratings r " +
                "JOIN users u1 ON r.evaluator_id = u1.id " +
                "JOIN users u2 ON r.evaluatee_id = u2.id " +
                "JOIN jobs j ON r.job_id = j.id " +
                "WHERE r.evaluatee_id = ? ORDER BY r.created_at DESC";
        List<Rating> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, evaluateeId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToRating(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching ratings for evaluatee: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean hasAlreadyRated(Long evaluatorId, Long evaluateeId, Long jobId) {
        String sql = "SELECT COUNT(*) FROM ratings WHERE evaluator_id = ? AND evaluatee_id = ? AND job_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, evaluatorId);
            pstmt.setLong(2, evaluateeId);
            pstmt.setLong(3, jobId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error checking rating status: " + e.getMessage(), e);
        }
        return false;
    }

    @Override
    public double getAverageRating(Long evaluateeId) {
        String sql = "SELECT AVG(rating) FROM ratings WHERE evaluatee_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, evaluateeId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble(1);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error getting average rating: " + e.getMessage(), e);
        }
        return 0.0;
    }

    private Rating mapResultSetToRating(ResultSet rs) throws SQLException {
        Rating r = new Rating();
        r.setId(rs.getLong("id"));
        r.setEvaluatorId(rs.getLong("evaluator_id"));
        r.setEvaluatorName(rs.getString("evaluator_name"));
        r.setEvaluateeId(rs.getLong("evaluatee_id"));
        r.setEvaluateeName(rs.getString("evaluatee_name"));
        r.setJobId(rs.getLong("job_id"));
        r.setJobTitle(rs.getString("job_title"));
        r.setRating(rs.getInt("rating"));
        r.setReviewText(rs.getString("review_text"));
        Timestamp c = rs.getTimestamp("created_at");
        if (c != null) r.setCreatedAt(c.toLocalDateTime());
        return r;
    }
}
