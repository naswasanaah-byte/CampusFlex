package com.campusflex.dao.impl;

import com.campusflex.dao.NotificationDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Notification;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class NotificationDAOImpl implements NotificationDAO {

    private final DataSource dataSource;

    public NotificationDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Notification create(Notification notification) {
        String sql = "INSERT INTO notifications (user_id, title, message, is_read, type) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, notification.getUserId());
            pstmt.setString(2, notification.getTitle());
            pstmt.setString(3, notification.getMessage());
            pstmt.setBoolean(4, notification.getIsRead() != null ? notification.getIsRead() : false);
            pstmt.setString(5, notification.getType());

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    notification.setId(rs.getLong(1));
                }
            }
            return notification;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating notification: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Notification> findByUserId(Long userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        List<Notification> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToNotification(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching notifications: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean markAsRead(Long notificationId, Long userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, notificationId);
            pstmt.setLong(2, userId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error marking notification as read: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean markAllAsRead(Long userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error marking all notifications as read: " + e.getMessage(), e);
        }
    }

    @Override
    public int countUnread(Long userId) {
        String sql = "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error counting unread notifications: " + e.getMessage(), e);
        }
        return 0;
    }

    private Notification mapResultSetToNotification(ResultSet rs) throws SQLException {
        Notification n = new Notification();
        n.setId(rs.getLong("id"));
        n.setUserId(rs.getLong("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setIsRead(rs.getBoolean("is_read"));
        n.setType(rs.getString("type"));
        Timestamp c = rs.getTimestamp("created_at");
        if (c != null) n.setCreatedAt(c.toLocalDateTime());
        return n;
    }
}
