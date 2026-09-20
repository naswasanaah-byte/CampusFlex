package com.campusflex.model;

public class AdminProfile {
    private Long id;
    private Long userId;
    private String fullName;
    private String department;

    public AdminProfile() {}

    public AdminProfile(Long id, Long userId, String fullName, String department) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
