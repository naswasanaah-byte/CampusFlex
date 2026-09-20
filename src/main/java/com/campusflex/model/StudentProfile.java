package com.campusflex.model;

import com.campusflex.model.enums.WorkType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class StudentProfile {
    private Long id;
    private Long userId;
    private String fullName;
    private String college;
    private String department;
    private Integer semester;
    private String bio;
    private String profilePhoto;
    private WorkType preferredWorkType;
    private String preferredLocation;
    private BigDecimal targetHourlyRate;
    private List<Skill> skills = new ArrayList<>();

    public StudentProfile() {}

    public StudentProfile(Long id, Long userId, String fullName, String college, String department, Integer semester) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.college = college;
        this.department = department;
        this.semester = semester;
    }

    public int calculateCompletionPercentage() {
        int total = 9;
        int completed = 0;
        if (fullName != null && !fullName.trim().isEmpty()) completed++;
        if (college != null && !college.trim().isEmpty()) completed++;
        if (department != null && !department.trim().isEmpty()) completed++;
        if (semester != null && semester > 0) completed++;
        if (bio != null && !bio.trim().isEmpty()) completed++;
        if (profilePhoto != null && !profilePhoto.trim().isEmpty()) completed++;
        if (preferredWorkType != null) completed++;
        if (preferredLocation != null && !preferredLocation.trim().isEmpty()) completed++;
        if (skills != null && !skills.isEmpty()) completed++;

        return (int) Math.round(((double) completed / total) * 100);
    }

    public List<String> getMissingFields() {
        List<String> missing = new ArrayList<>();
        if (fullName == null || fullName.trim().isEmpty()) missing.add("Full Name");
        if (college == null || college.trim().isEmpty()) missing.add("College");
        if (department == null || department.trim().isEmpty()) missing.add("Department");
        if (semester == null || semester <= 0) missing.add("Semester");
        if (bio == null || bio.trim().isEmpty()) missing.add("Bio");
        if (profilePhoto == null || profilePhoto.trim().isEmpty()) missing.add("Profile Photo");
        if (preferredWorkType == null) missing.add("Preferred Work Type");
        if (preferredLocation == null || preferredLocation.trim().isEmpty()) missing.add("Preferred Location");
        if (skills == null || skills.isEmpty()) missing.add("Skills");
        return missing;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public WorkType getPreferredWorkType() { return preferredWorkType; }
    public void setPreferredWorkType(WorkType preferredWorkType) { this.preferredWorkType = preferredWorkType; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public BigDecimal getTargetHourlyRate() { return targetHourlyRate; }
    public void setTargetHourlyRate(BigDecimal targetHourlyRate) { this.targetHourlyRate = targetHourlyRate; }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }
}
