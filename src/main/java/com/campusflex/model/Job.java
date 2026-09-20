package com.campusflex.model;

import com.campusflex.model.enums.JobStatus;
import com.campusflex.model.enums.SalaryType;
import com.campusflex.model.enums.WorkType;
import com.campusflex.model.interfaces.Matchable;
import com.campusflex.model.interfaces.Searchable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Job implements Searchable, Matchable {
    private Long id;
    private Long employerId;
    private String companyName;
    private String companyLogo;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String requirements;
    private BigDecimal salaryAmount;
    private SalaryType salaryType = SalaryType.DAILY;
    private String location;
    private WorkType workType = WorkType.ON_SITE;
    private LocalTime startTime;
    private LocalTime endTime;
    private String workingDays; // e.g. "MONDAY,WEDNESDAY,FRIDAY"
    private Integer vacancies = 1;
    private JobStatus status = JobStatus.ACTIVE;
    private Boolean isVerified = false;
    private LocalDate deadline;
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<Skill> requiredSkills = new ArrayList<>();

    public Job() {}

    @Override
    public String getSearchKeywords() {
        StringBuilder sb = new StringBuilder();
        sb.append(title).append(" ").append(companyName).append(" ").append(categoryName).append(" ").append(location);
        for (Skill s : requiredSkills) {
            sb.append(" ").append(s.getSkillName());
        }
        return sb.toString().toLowerCase();
    }

    @Override
    public List<String> getSkillNames() {
        return requiredSkills.stream()
                .map(Skill::getSkillName)
                .collect(Collectors.toList());
    }

    public boolean isExpired() {
        return (deadline != null && LocalDate.now().isAfter(deadline)) || status == JobStatus.EXPIRED;
    }

    // Getters and Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    @Override
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public BigDecimal getSalaryAmount() { return salaryAmount; }
    public void setSalaryAmount(BigDecimal salaryAmount) { this.salaryAmount = salaryAmount; }

    public SalaryType getSalaryType() { return salaryType; }
    public void setSalaryType(SalaryType salaryType) { this.salaryType = salaryType; }

    @Override
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public WorkType getWorkType() { return workType; }
    public void setWorkType(WorkType workType) { this.workType = workType; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getWorkingDays() { return workingDays; }
    public void setWorkingDays(String workingDays) { this.workingDays = workingDays; }

    public Integer getVacancies() { return vacancies; }
    public void setVacancies(Integer vacancies) { this.vacancies = vacancies; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Skill> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<Skill> requiredSkills) { this.requiredSkills = requiredSkills; }
}
