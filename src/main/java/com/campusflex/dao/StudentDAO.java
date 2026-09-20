package com.campusflex.dao;

import com.campusflex.model.Skill;
import com.campusflex.model.StudentProfile;

import java.util.List;
import java.util.Optional;

public interface StudentDAO {
    StudentProfile createProfile(StudentProfile profile);
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findById(Long id);
    boolean updateProfile(StudentProfile profile);
    
    List<Skill> getStudentSkills(Long studentId);
    void addSkill(Long studentId, Long skillId, String proficiencyLevel);
    void removeSkill(Long studentId, Long skillId);
    void updateSkills(Long studentId, List<Long> skillIds);
    
    List<Skill> getAllAvailableSkills();
}
