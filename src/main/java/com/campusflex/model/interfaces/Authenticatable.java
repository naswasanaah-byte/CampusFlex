package com.campusflex.model.interfaces;

import com.campusflex.model.enums.UserRole;

public interface Authenticatable {
    Long getId();
    String getEmail();
    String getPasswordHash();
    UserRole getRole();
}
