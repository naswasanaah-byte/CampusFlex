package com.campusflex.model;

import com.campusflex.model.enums.UserRole;

public class AdminUser extends User {
    private AdminProfile profile;

    public AdminUser() {
        setRole(UserRole.ADMIN);
    }

    public AdminUser(Long id, String email, String phone, String passwordHash, AdminProfile profile) {
        super(id, email, phone, passwordHash, UserRole.ADMIN);
        this.profile = profile;
    }

    @Override
    public String getDisplayName() {
        if (profile != null && profile.getFullName() != null && !profile.getFullName().isEmpty()) {
            return profile.getFullName();
        }
        return getEmail();
    }

    public AdminProfile getProfile() {
        return profile;
    }

    public void setProfile(AdminProfile profile) {
        this.profile = profile;
    }
}
