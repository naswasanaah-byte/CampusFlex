package com.campusflex.dao.impl;

import com.campusflex.dao.StudentDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Skill;
import com.campusflex.model.StudentProfile;
import com.campusflex.model.enums.WorkType;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentDAOImpl implements StudentDAO {

    private final DataSource dataSource;

    public StudentDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public StudentProfile createProfile(StudentProfile profile) {
        String sql = "INSERT INTO student_profiles (user_id, full_name, college, department, semester, bio, profile_photo, preferred_work_type, preferred_location, target_hourly_rate) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, profile.getUserId());
            pstmt.setString(2, profile.getFullName());
            pstmt.setString(3, profile.getCollege());
            pstmt.setString(4, profile.getDepartment());
            if (profile.getSemester() != null) pstmt.setInt(5, profile.getSemester()); else pstmt.setNull(5, Types.INTEGER);
            pstmt.setString(6, profile.getBio());
            pstmt.setString(7, profile.getProfilePhoto());
            pstmt.setString(8, profile.getPreferredWorkType() != null ? profile.getPreferredWorkType().name() : null);
            pstmt.setString(9, profile.getPreferredLocation());
            if (profile.getTargetHourlyRate() != null) pstmt.setBigDecimal(10, profile.getTargetHourlyRate()); else pstmt.setNull(10, Types.DECIMAL);

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    profile.setId(rs.getLong(1));
                }
            }
            return profile;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<StudentProfile> findByUserId(Long userId) {
        String sql = "SELECT * FROM student_profiles WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    StudentProfile profile = mapResultSetToStudentProfile(rs);
                    profile.setSkills(getStudentSkills(profile.getId()));
                    return Optional.of(profile);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching student profile by user_id: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<StudentProfile> findById(Long id) {
        String sql = "SELECT * FROM student_profiles WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    StudentProfile profile = mapResultSetToStudentProfile(rs);
                    profile.setSkills(getStudentSkills(profile.getId()));
                    return Optional.of(profile);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching student profile by id: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public boolean updateProfile(StudentProfile profile) {
        String sql = "UPDATE student_profiles SET full_name = ?, college = ?, department = ?, semester = ?, bio = ?, profile_photo = ?, preferred_work_type = ?, preferred_location = ?, target_hourly_rate = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, profile.getFullName());
            pstmt.setString(2, profile.getCollege());
            pstmt.setString(3, profile.getDepartment());
            if (profile.getSemester() != null) pstmt.setInt(4, profile.getSemester()); else pstmt.setNull(4, Types.INTEGER);
            pstmt.setString(5, profile.getBio());
            pstmt.setString(6, profile.getProfilePhoto());
            pstmt.setString(7, profile.getPreferredWorkType() != null ? profile.getPreferredWorkType().name() : null);
            pstmt.setString(8, profile.getPreferredLocation());
            if (profile.getTargetHourlyRate() != null) pstmt.setBigDecimal(9, profile.getTargetHourlyRate()); else pstmt.setNull(9, Types.DECIMAL);
            pstmt.setLong(10, profile.getId());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating student profile: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Skill> getStudentSkills(Long studentId) {
        String sql = "SELECT s.id, s.skill_name, s.category FROM skills s " +
                "JOIN student_skills ss ON s.id = ss.skill_id WHERE ss.student_id = ?";
        List<Skill> skills = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    skills.add(new Skill(rs.getLong("id"), rs.getString("skill_name"), rs.getString("category")));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching student skills: " + e.getMessage(), e);
        }
        return skills;
    }

    @Override
    public void addSkill(Long studentId, Long skillId, String proficiencyLevel) {
        String sql = "INSERT INTO student_skills (student_id, skill_id, proficiency_level) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, skillId);
            pstmt.setString(3, proficiencyLevel != null ? proficiencyLevel : "INTERMEDIATE");
            pstmt.executeUpdate();
        } catch (SQLException e) {
            // Ignore duplicate skill insertion
        }
    }

    @Override
    public void removeSkill(Long studentId, Long skillId) {
        String sql = "DELETE FROM student_skills WHERE student_id = ? AND skill_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, studentId);
            pstmt.setLong(2, skillId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new DatabaseException("Error removing student skill: " + e.getMessage(), e);
        }
    }

    @Override
    public void updateSkills(Long studentId, List<Long> skillIds) {
        String deleteSql = "DELETE FROM student_skills WHERE student_id = ?";
        String insertSql = "INSERT INTO student_skills (student_id, skill_id, proficiency_level) VALUES (?, ?, 'INTERMEDIATE')";
        
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql);
                 PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                
                deleteStmt.setLong(1, studentId);
                deleteStmt.executeUpdate();

                for (Long skillId : skillIds) {
                    insertStmt.setLong(1, studentId);
                    insertStmt.setLong(2, skillId);
                    insertStmt.addBatch();
                }
                insertStmt.executeBatch();
                conn.commit();
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error updating student skills in transaction: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Skill> getAllAvailableSkills() {
        String sql = "SELECT id, skill_name, category FROM skills ORDER BY skill_name ASC";
        List<Skill> skills = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                skills.add(new Skill(rs.getLong("id"), rs.getString("skill_name"), rs.getString("category")));
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching available skills: " + e.getMessage(), e);
        }
        return skills;
    }

    private StudentProfile mapResultSetToStudentProfile(ResultSet rs) throws SQLException {
        StudentProfile p = new StudentProfile();
        p.setId(rs.getLong("id"));
        p.setUserId(rs.getLong("user_id"));
        p.setFullName(rs.getString("full_name"));
        p.setCollege(rs.getString("college"));
        p.setDepartment(rs.getString("department"));
        int sem = rs.getInt("semester");
        if (!rs.wasNull()) p.setSemester(sem);
        p.setBio(rs.getString("bio"));
        p.setProfilePhoto(rs.getString("profile_photo"));
        String workType = rs.getString("preferred_work_type");
        if (workType != null) p.setPreferredWorkType(WorkType.valueOf(workType));
        p.setPreferredLocation(rs.getString("preferred_location"));
        p.setTargetHourlyRate(rs.getBigDecimal("target_hourly_rate"));
        return p;
    }
}
