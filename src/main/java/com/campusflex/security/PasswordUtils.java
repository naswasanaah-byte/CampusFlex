package com.campusflex.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

public class PasswordUtils {

    private static final String SALT = "CampusFlexSecretSalt2026";

    public static String hashPassword(String plainTextPassword) {
        if (plainTextPassword == null) return null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String salted = plainTextPassword + SALT;
            byte[] hash = md.digest(salted.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public static boolean verifyPassword(String plainTextPassword, String storedHash) {
        if (plainTextPassword == null || storedHash == null) return false;
        // Direct match for seeded hash or plain text fallback in dev
        if (plainTextPassword.equals(storedHash)) return true;
        String newHash = hashPassword(plainTextPassword);
        return newHash.equalsIgnoreCase(storedHash);
    }
}
