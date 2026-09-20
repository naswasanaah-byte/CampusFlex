package com.campusflex.dao.impl;

import com.campusflex.dao.MessageDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Message;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MessageDAOImpl implements MessageDAO {

    private final DataSource dataSource;

    public MessageDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Message create(Message message) {
        String sql = "INSERT INTO messages (sender_id, receiver_id, job_id, content, is_read) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, message.getSenderId());
            pstmt.setLong(2, message.getReceiverId());
            if (message.getJobId() != null) pstmt.setLong(3, message.getJobId()); else pstmt.setNull(3, Types.BIGINT);
            pstmt.setString(4, message.getContent());
            pstmt.setBoolean(5, false);

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    message.setId(rs.getLong(1));
                }
            }
            return message;
        } catch (SQLException e) {
            throw new DatabaseException("Error sending message: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Message> getConversation(Long userId1, Long userId2, Long jobId) {
        StringBuilder sql = new StringBuilder(
                "SELECT m.*, u1.email as sender_name, u2.email as receiver_name " +
                "FROM messages m " +
                "JOIN users u1 ON m.sender_id = u1.id " +
                "JOIN users u2 ON m.receiver_id = u2.id " +
                "WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) "
        );

        if (jobId != null) {
            sql.append("AND m.job_id = ? ");
        }
        sql.append("ORDER BY m.sent_at ASC");

        List<Message> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            pstmt.setLong(1, userId1);
            pstmt.setLong(2, userId2);
            pstmt.setLong(3, userId2);
            pstmt.setLong(4, userId1);
            if (jobId != null) {
                pstmt.setLong(5, jobId);
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToMessage(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching conversation: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<Message> getUserInbox(Long userId) {
        String sql = "SELECT m.*, u1.email as sender_name, u2.email as receiver_name " +
                "FROM messages m " +
                "JOIN users u1 ON m.sender_id = u1.id " +
                "JOIN users u2 ON m.receiver_id = u2.id " +
                "WHERE m.sender_id = ? OR m.receiver_id = ? " +
                "ORDER BY m.sent_at DESC";
        List<Message> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            pstmt.setLong(2, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToMessage(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching user inbox: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean markConversationAsRead(Long receiverId, Long senderId) {
        String sql = "UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND sender_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, receiverId);
            pstmt.setLong(2, senderId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error marking conversation as read: " + e.getMessage(), e);
        }
    }

    @Override
    public int countUnreadMessages(Long userId) {
        String sql = "SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND is_read = FALSE";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error counting unread messages: " + e.getMessage(), e);
        }
        return 0;
    }

    private Message mapResultSetToMessage(ResultSet rs) throws SQLException {
        Message m = new Message();
        m.setId(rs.getLong("id"));
        m.setSenderId(rs.getLong("sender_id"));
        m.setSenderName(rs.getString("sender_name"));
        m.setReceiverId(rs.getLong("receiver_id"));
        m.setReceiverName(rs.getString("receiver_name"));
        long jId = rs.getLong("job_id");
        if (!rs.wasNull()) m.setJobId(jId);
        m.setContent(rs.getString("content"));
        m.setIsRead(rs.getBoolean("is_read"));
        Timestamp s = rs.getTimestamp("sent_at");
        if (s != null) m.setSentAt(s.toLocalDateTime());
        return m;
    }
}
