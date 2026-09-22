package com.campusflex.service;

import com.campusflex.model.User;
import java.util.ArrayList;

public class GoogleAuthService {

    public static String formatHumanName(String name, String email) {
        if (name != null && !name.trim().isEmpty() &&
            !name.toLowerCase().contains("user.google") &&
            !name.toLowerCase().contains("google user")) {
            return name.trim();
        }

        if (email != null && email.contains("@")) {
            String prefix = email.split("@")[0];
            String clean = prefix.replaceAll("[0-9]", "")
                                 .replaceAll("[\\._-]", " ")
                                 .trim();
            String[] words = clean.split("\\s+");
            StringBuilder sb = new StringBuilder();
            for (String w : words) {
                if (!w.isEmpty()) {
                    if (sb.length() > 0) sb.append(" ");
                    sb.append(Character.toUpperCase(w.charAt(0)))
                      .append(w.substring(1).toLowerCase());
                }
            }
            if (sb.length() > 0) {
                return sb.toString();
            }
        }

        return "Student User";
    }

    public static User processGoogleAuth(String email, String name, String avatar, String role) {
        String cleanEmail = email.toLowerCase().trim();
        String displayName = formatHumanName(name, cleanEmail);

        User user = new User();
        user.setId("user-google-" + System.currentTimeMillis());
        user.setGoogleId("google-uid-" + System.currentTimeMillis());
        user.setAuthProvider("google");
        user.setName(displayName);
        user.setEmail(cleanEmail);
        user.setRole(role != null ? role : "student");
        user.setAvatar(avatar != null ? avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80");
        user.setVerified(true);
        user.setDepartment("Computer Science");
        user.setYear("Semester 1");
        user.setStatus("active");
        user.setCreatedAt(java.time.Instant.now().toString());

        ArrayList<String> skills = new ArrayList<>();
        skills.add("Problem Solving");
        skills.add("Communication");
        user.setSkills(skills);

        return user;
    }
}
