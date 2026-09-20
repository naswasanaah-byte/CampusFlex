package com.campusflex.model;

import com.campusflex.model.enums.UserRole;

public class StudentUser extends User {
    private StudentProfile profile;

    public StudentUser() {
        setRole(UserRole.STUDENT);
    }

    public StudentUser(Long id, String email, String phone, String passwordHash, StudentProfile profile) {
        super(id, email, phone, passwordHash, UserRole.STUDENT);
        this.profile = profile;
    }

    @Override
    public String getDisplayName() {
        if (profile != null && profile.getFullName() != null && !profile.getFullName().isEmpty()) {
            return profile.getFullName();
        }
        return getEmail();
    }

    public StudentProfile getProfile() {
        return profile;
    }

    public void setProfile(StudentProfile profile) {
        this.profile = profile;
    }
}
