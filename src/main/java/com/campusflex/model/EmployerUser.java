package com.campusflex.model;

import com.campusflex.model.enums.UserRole;

public class EmployerUser extends User {
    private EmployerProfile profile;

    public EmployerUser() {
        setRole(UserRole.EMPLOYER);
    }

    public EmployerUser(Long id, String email, String phone, String passwordHash, EmployerProfile profile) {
        super(id, email, phone, passwordHash, UserRole.EMPLOYER);
        this.profile = profile;
    }

    @Override
    public String getDisplayName() {
        if (profile != null && profile.getCompanyName() != null && !profile.getCompanyName().isEmpty()) {
            return profile.getCompanyName();
        }
        return getEmail();
    }

    public EmployerProfile getProfile() {
        return profile;
    }

    public void setProfile(EmployerProfile profile) {
        this.profile = profile;
    }
}
