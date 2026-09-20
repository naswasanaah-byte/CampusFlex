package com.campusflex.dao.impl;

import com.campusflex.dao.JobDAO;
import com.campusflex.exception.DatabaseException;
import com.campusflex.model.Job;
import com.campusflex.model.Skill;
import com.campusflex.model.enums.JobStatus;
import com.campusflex.model.enums.SalaryType;
import com.campusflex.model.enums.WorkType;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class JobDAOImpl implements JobDAO {

    private final DataSource dataSource;

    public JobDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Job create(Job job) {
        String sql = "INSERT INTO jobs (employer_id, category_id, title, description, requirements, salary_amount, salary_type, location, work_type, start_time, end_time, working_days, vacancies, status, is_verified, deadline) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setLong(1, job.getEmployerId());
            pstmt.setLong(2, job.getCategoryId());
            pstmt.setString(3, job.getTitle());
            pstmt.setString(4, job.getDescription());
            pstmt.setString(5, job.getRequirements());
            pstmt.setBigDecimal(6, job.getSalaryAmount());
            pstmt.setString(7, job.getSalaryType() != null ? job.getSalaryType().name() : "DAILY");
            pstmt.setString(8, job.getLocation());
            pstmt.setString(9, job.getWorkType() != null ? job.getWorkType().name() : "ON_SITE");
            pstmt.setTime(10, Time.valueOf(job.getStartTime()));
            pstmt.setTime(11, Time.valueOf(job.getEndTime()));
            pstmt.setString(12, job.getWorkingDays());
            pstmt.setInt(13, job.getVacancies() != null ? job.getVacancies() : 1);
            pstmt.setString(14, job.getStatus() != null ? job.getStatus().name() : "ACTIVE");
            pstmt.setBoolean(15, job.getIsVerified() != null ? job.getIsVerified() : false);
            pstmt.setDate(16, Date.valueOf(job.getDeadline()));

            pstmt.executeUpdate();
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    job.setId(rs.getLong(1));
                }
            }
            if (job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) {
                List<Long> skillIds = job.getRequiredSkills().stream().map(Skill::getId).toList();
                setJobSkills(job.getId(), skillIds);
            }
            return job;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating job posting: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Job> findById(Long id) {
        String sql = "SELECT j.*, ep.company_name, ep.logo_url as company_logo, jc.name as category_name " +
                "FROM jobs j " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "JOIN job_categories jc ON j.category_id = jc.id " +
                "WHERE j.id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Job job = mapResultSetToJob(rs);
                    job.setRequiredSkills(getJobSkills(job.getId()));
                    return Optional.of(job);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding job by ID: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public List<Job> searchJobs(String keyword, Long categoryId, String location, WorkType workType, Boolean verifiedOnly, int limit, int offset) {
        StringBuilder sql = new StringBuilder(
                "SELECT j.*, ep.company_name, ep.logo_url as company_logo, jc.name as category_name " +
                "FROM jobs j " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "JOIN job_categories jc ON j.category_id = jc.id " +
                "WHERE j.status = 'ACTIVE' AND (j.deadline >= CURRENT_DATE OR j.deadline IS NULL) "
        );

        List<Object> params = new ArrayList<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append("AND (LOWER(j.title) LIKE ? OR LOWER(j.description) LIKE ? OR LOWER(ep.company_name) LIKE ?) ");
            String k = "%" + keyword.trim().toLowerCase() + "%";
            params.add(k);
            params.add(k);
            params.add(k);
        }

        if (categoryId != null) {
            sql.append("AND j.category_id = ? ");
            params.add(categoryId);
        }

        if (location != null && !location.trim().isEmpty()) {
            sql.append("AND LOWER(j.location) LIKE ? ");
            params.add("%" + location.trim().toLowerCase() + "%");
        }

        if (workType != null) {
            sql.append("AND j.work_type = ? ");
            params.add(workType.name());
        }

        if (Boolean.TRUE.equals(verifiedOnly)) {
            sql.append("AND j.is_verified = TRUE ");
        }

        sql.append("ORDER BY j.created_at DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        List<Job> jobs = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Job job = mapResultSetToJob(rs);
                    job.setRequiredSkills(getJobSkills(job.getId()));
                    jobs.add(job);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error searching jobs: " + e.getMessage(), e);
        }
        return jobs;
    }

    @Override
    public List<Job> findByEmployerId(Long employerId) {
        String sql = "SELECT j.*, ep.company_name, ep.logo_url as company_logo, jc.name as category_name " +
                "FROM jobs j " +
                "JOIN employer_profiles ep ON j.employer_id = ep.id " +
                "JOIN job_categories jc ON j.category_id = jc.id " +
                "WHERE j.employer_id = ? ORDER BY j.created_at DESC";
        List<Job> jobs = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, employerId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Job job = mapResultSetToJob(rs);
                    job.setRequiredSkills(getJobSkills(job.getId()));
                    jobs.add(job);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error finding jobs by employer ID: " + e.getMessage(), e);
        }
        return jobs;
    }

    @Override
    public List<Job> findAllActiveJobs() {
        return searchJobs(null, null, null, null, false, 100, 0);
    }

    @Override
    public boolean update(Job job) {
        String sql = "UPDATE jobs SET title = ?, description = ?, requirements = ?, salary_amount = ?, salary_type = ?, location = ?, work_type = ?, start_time = ?, end_time = ?, working_days = ?, vacancies = ?, deadline = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, job.getTitle());
            pstmt.setString(2, job.getDescription());
            pstmt.setString(3, job.getRequirements());
            pstmt.setBigDecimal(4, job.getSalaryAmount());
            pstmt.setString(5, job.getSalaryType().name());
            pstmt.setString(6, job.getLocation());
            pstmt.setString(7, job.getWorkType().name());
            pstmt.setTime(8, Time.valueOf(job.getStartTime()));
            pstmt.setTime(9, Time.valueOf(job.getEndTime()));
            pstmt.setString(10, job.getWorkingDays());
            pstmt.setInt(11, job.getVacancies());
            pstmt.setDate(12, Date.valueOf(job.getDeadline()));
            pstmt.setLong(13, job.getId());

            boolean updated = pstmt.executeUpdate() > 0;
            if (updated && job.getRequiredSkills() != null) {
                List<Long> skillIds = job.getRequiredSkills().stream().map(Skill::getId).toList();
                setJobSkills(job.getId(), skillIds);
            }
            return updated;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating job: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updateStatus(Long jobId, JobStatus status) {
        String sql = "UPDATE jobs SET status = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, status.name());
            pstmt.setLong(2, jobId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating job status: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean decrementVacancies(Connection conn, Long jobId) {
        String sql = "UPDATE jobs SET vacancies = vacancies - 1 WHERE id = ? AND vacancies > 0";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, jobId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error decrementing job vacancies in transaction: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM jobs WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting job: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Skill> getJobSkills(Long jobId) {
        String sql = "SELECT s.id, s.skill_name, s.category FROM skills s " +
                "JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?";
        List<Skill> skills = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, jobId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    skills.add(new Skill(rs.getLong("id"), rs.getString("skill_name"), rs.getString("category")));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching job required skills: " + e.getMessage(), e);
        }
        return skills;
    }

    @Override
    public void setJobSkills(Long jobId, List<Long> skillIds) {
        String deleteSql = "DELETE FROM job_skills WHERE job_id = ?";
        String insertSql = "INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql);
                 PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                
                deleteStmt.setLong(1, jobId);
                deleteStmt.executeUpdate();

                for (Long sId : skillIds) {
                    insertStmt.setLong(1, jobId);
                    insertStmt.setLong(2, sId);
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
            throw new DatabaseException("Error setting job skills: " + e.getMessage(), e);
        }
    }

    private Job mapResultSetToJob(ResultSet rs) throws SQLException {
        Job job = new Job();
        job.setId(rs.getLong("id"));
        job.setEmployerId(rs.getLong("employer_id"));
        job.setCompanyName(rs.getString("company_name"));
        job.setCompanyLogo(rs.getString("company_logo"));
        job.setCategoryId(rs.getLong("category_id"));
        job.setCategoryName(rs.getString("category_name"));
        job.setTitle(rs.getString("title"));
        job.setDescription(rs.getString("description"));
        job.setRequirements(rs.getString("requirements"));
        job.setSalaryAmount(rs.getBigDecimal("salary_amount"));
        String sType = rs.getString("salary_type");
        if (sType != null) job.setSalaryType(SalaryType.valueOf(sType));
        job.setLocation(rs.getString("location"));
        String wType = rs.getString("work_type");
        if (wType != null) job.setWorkType(WorkType.valueOf(wType));
        Time st = rs.getTime("start_time");
        if (st != null) job.setStartTime(st.toLocalTime());
        Time et = rs.getTime("end_time");
        if (et != null) job.setEndTime(et.toLocalTime());
        job.setWorkingDays(rs.getString("working_days"));
        job.setVacancies(rs.getInt("vacancies"));
        String status = rs.getString("status");
        if (status != null) job.setStatus(JobStatus.valueOf(status));
        job.setIsVerified(rs.getBoolean("is_verified"));
        Date d = rs.getDate("deadline");
        if (d != null) job.setDeadline(d.toLocalDate());
        Timestamp c = rs.getTimestamp("created_at");
        if (c != null) job.setCreatedAt(c.toLocalDateTime());
        return job;
    }
}
