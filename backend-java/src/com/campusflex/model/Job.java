package com.campusflex.model;

import java.util.List;

public class Job {
    private String id;
    private String title;
    private String company;
    private String companyLogo;
    private String employerId;
    private String location;
    private Double hourlyRate;
    private Integer hoursPerWeek;
    private String workType;
    private String description;
    private List<String> requirements;
    private String status;
    private Integer slotsAvailable;
    private Integer selectedEmployees;
    private String postedAt;

    public Job() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public String getEmployerId() { return employerId; }
    public void setEmployerId(String employerId) { this.employerId = employerId; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public Integer getHoursPerWeek() { return hoursPerWeek; }
    public void setHoursPerWeek(Integer hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSlotsAvailable() { return slotsAvailable; }
    public void setSlotsAvailable(Integer slotsAvailable) { this.slotsAvailable = slotsAvailable; }

    public Integer getSelectedEmployees() { return selectedEmployees; }
    public void setSelectedEmployees(Integer selectedEmployees) { this.selectedEmployees = selectedEmployees; }

    public String getPostedAt() { return postedAt; }
    public void setPostedAt(String postedAt) { this.postedAt = postedAt; }
}
