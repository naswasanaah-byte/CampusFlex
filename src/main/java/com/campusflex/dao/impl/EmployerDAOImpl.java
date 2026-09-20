package com.campusflex.dao.impl;

import com.campusflex.dao.EmployerDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.EmployerProfile;
import com.campusflex.model.enums.VerificationStatus;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EmployerDAOImpl implements EmployerDAO {

    private final DataSource dataSource;

    public EmployerDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public EmployerProfile createProfile(EmployerProfile profile) {
        String sql = "INSERT INTO employer_profiles (user_id, company_name, company_description, industry, company_size, website, logo_url, location, verification_status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, profile.getUserId());
            pstmt.setString(2, profile.getCompanyName());
            pstmt.setString(3, profile.getCompanyDescription());
            pstmt.setString(4, profile.getIndustry());
            pstmt.setString(5, profile.getCompanySize());
            pstmt.setString(6, profile.getWebsite());
            pstmt.setString(7, profile.getLogoUrl());
            pstmt.setString(8, profile.getLocation());
            pstmt.setString(9, profile.getVerificationStatus() != null ? profile.getVerificationStatus().name() : "PENDING");

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    profile.setId(rs.getLong(1));
                }
            }
            return profile;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating employer profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<EmployerProfile> findByUserId(Long userId) {
        String sql = "SELECT * FROM employer_profiles WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToEmployerProfile(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching employer profile by user_id: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<EmployerProfile> findById(Long id) {
        String sql = "SELECT * FROM employer_profiles WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToEmployerProfile(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching employer profile by id: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public List<EmployerProfile> findAll() {
        String sql = "SELECT * FROM employer_profiles";
        List<EmployerProfile> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                list.add(mapResultSetToEmployerProfile(rs));
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching all employer profiles: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public List<EmployerProfile> findByVerificationStatus(VerificationStatus status) {
        String sql = "SELECT * FROM employer_profiles WHERE verification_status = ?";
        List<EmployerProfile> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToEmployerProfile(rs));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching employer profiles by status: " + e.getMessage(), e);
        }
        return list;
    }

    @Override
    public boolean updateProfile(EmployerProfile profile) {
        String sql = "UPDATE employer_profiles SET company_name = ?, company_description = ?, industry = ?, company_size = ?, website = ?, logo_url = ?, location = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, profile.getCompanyName());
            pstmt.setString(2, profile.getCompanyDescription());
            pstmt.setString(3, profile.getIndustry());
            pstmt.setString(4, profile.getCompanySize());
            pstmt.setString(5, profile.getWebsite());
            pstmt.setString(6, profile.getLogoUrl());
            pstmt.setString(7, profile.getLocation());
            pstmt.setLong(8, profile.getId());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating employer profile: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updateVerificationStatus(Long employerId, VerificationStatus status) {
        String sql = "UPDATE employer_profiles SET verification_status = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            pstmt.setLong(2, employerId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating employer verification status: " + e.getMessage(), e);
        }
    }

    private EmployerProfile mapResultSetToEmployerProfile(ResultSet rs) throws SQLException {
        EmployerProfile p = new EmployerProfile();
        p.setId(rs.getLong("id"));
        p.setUserId(rs.getLong("user_id"));
        p.setCompanyName(rs.getString("company_name"));
        p.setCompanyDescription(rs.getString("company_description"));
        p.setIndustry(rs.getString("industry"));
        p.setCompanySize(rs.getString("company_size"));
        p.setWebsite(rs.getString("website"));
        p.setLogoUrl(rs.getString("logo_url"));
        p.setLocation(rs.getString("location"));
        String status = rs.getString("verification_status");
        if (status != null) p.setVerificationStatus(VerificationStatus.valueOf(status));
        return p;
    }
}
