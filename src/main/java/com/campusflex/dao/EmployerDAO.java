package com.campusflex.dao;

import com.campusflex.model.EmployerProfile;
import com.campusflex.model.enums.VerificationStatus;

import java.util.List;
import java.util.Optional;

public interface EmployerDAO {
    EmployerProfile createProfile(EmployerProfile profile);
    Optional<EmployerProfile> findByUserId(Long userId);
    Optional<EmployerProfile> findById(Long id);
    List<EmployerProfile> findAll();
    List<EmployerProfile> findByVerificationStatus(VerificationStatus status);
    boolean updateProfile(EmployerProfile profile);
    boolean updateVerificationStatus(Long employerId, VerificationStatus status);
}
