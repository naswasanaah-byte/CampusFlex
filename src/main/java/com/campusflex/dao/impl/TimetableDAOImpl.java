package com.campusflex.dao.impl;

import com.campusflex.dao.TimetableDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.DayOfWeek;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TimetableDAOImpl implements TimetableDAO {

    private final DataSource dataSource;

    public TimetableDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public TimetableEntry addEntry(TimetableEntry entry) {
        String sql = "INSERT INTO timetables (student_id, day_of_week, start_time, end_time, subject_name, type) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, entry.getStudentId());
            pstmt.setString(2, entry.getDayOfWeek().name());
            pstmt.setTime(3, Time.valueOf(entry.getStartTime()));
            pstmt.setTime(4, Time.valueOf(entry.getEndTime()));
            pstmt.setString(5, entry.getSubjectName());
            pstmt.setString(6, entry.getType() != null ? entry.getType() : "Lecture");

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    entry.setId(rs.getLong(1));
                }
            }
            return entry;
        } catch (SQLException e) {
            throw new DatabaseException("Error adding timetable entry: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TimetableEntry> findByStudentId(Long studentId) {
        String sql = "SELECT * FROM timetables WHERE student_id = ? ORDER BY day_of_week, start_time";
        List<TimetableEntry> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTimetableEntry(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching student timetable: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<TimetableEntry> findByStudentIdAndDay(Long studentId, DayOfWeek dayOfWeek) {
        String sql = "SELECT * FROM timetables WHERE student_id = ? AND day_of_week = ? ORDER BY start_time";
        List<TimetableEntry> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setString(2, dayOfWeek.name());
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToTimetableEntry(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching student timetable for day: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean deleteEntry(Long id, Long studentId) {
        String sql = "DELETE FROM timetables WHERE id = ? AND student_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            pstmt.setLong(2, studentId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting timetable entry: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean clearTimetable(Long studentId) {
        String sql = "DELETE FROM timetables WHERE student_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error clearing student timetable: " + e.getMessage(), e);
        }
    }

    private TimetableEntry mapResultSetToTimetableEntry(ResultSet rs) throws SQLException {
        TimetableEntry t = new TimetableEntry();
        t.setId(rs.getLong("id"));
        t.setStudentId(rs.getLong("student_id"));
        t.setDayOfWeek(DayOfWeek.valueOf(rs.getString("day_of_week")));
        t.setStartTime(rs.getTime("start_time").toLocalTime());
        t.setEndTime(rs.getTime("end_time").toLocalTime());
        t.setSubjectName(rs.getString("subject_name"));
        t.setType(rs.getString("type"));
        return t;
    }
}
