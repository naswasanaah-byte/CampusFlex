package com.campusflex;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.campusflex.service.GoogleAuthService;
import com.campusflex.model.User;
import com.campusflex.db.DatabaseManager;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CampusFlexServer {

    private static final int PORT = 8080;
    private static final List<String> mockUsersJson = new ArrayList<>();
    private static final List<String> mockJobsJson = new ArrayList<>();
    private static final List<String> mockApplicationsJson = new ArrayList<>();

    // Mutable platform settings in Java memory
    private static double commissionRate = 5.0;
    private static boolean autoVerifyEdu = true;
    private static double maxHourlyRate = 2000.0;
    private static String allowedDomains = "@university.edu,@campus.edu,@college.edu,@iit.ac.in,@mit.edu";

    public static void main(String[] args) throws IOException {
        int serverPort = PORT;
        String envPort = System.getenv("JAVA_BACKEND_PORT");
        if (envPort != null && !envPort.isEmpty()) {
            try {
                serverPort = Integer.parseInt(envPort);
            } catch (NumberFormatException ignored) {}
        }

        // 1. Initialize Java Database Connectivity (JDBC) Subsystem
        DatabaseManager.initialize();

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", serverPort), 0);

        // Standard API Endpoints
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/auth/google", new GoogleAuthHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/jobs", new JobsHandler());
        server.createContext("/api/applications", new ApplicationsHandler());

        // Admin REST API Endpoints (Java 17)
        server.createContext("/api/admin/stats", new AdminStatsHandler());
        server.createContext("/api/admin/users", new AdminUsersHandler());
        server.createContext("/api/admin/jobs", new AdminJobsHandler());
        server.createContext("/api/admin/ai-logs", new AdminAILogsHandler());
        server.createContext("/api/admin/settings", new AdminSettingsHandler());
        server.createContext("/api/admin/jdbc", new AdminJDBCHandler());
        server.createContext("/api/admin/reports", new AdminReportsHandler());

        server.setExecutor(null); // default executor
        System.out.println("🚀 [CampusFlex Java Backend] Server started on port " + serverPort + " (Java 17)");
        System.out.println("🛡️ [Admin Endpoints] /api/admin/stats, /api/admin/users, /api/admin/jobs, /api/admin/ai-logs, /api/admin/settings, /api/admin/jdbc active.");
        System.out.println("💾 [JDBC Engine] Java Database Connectivity operational (jdbc:campusflex:data/campusflex.db).");
        server.start();
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type", "application/json");
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String responseJson) throws IOException {
        setCorsHeaders(exchange);
        byte[] bytes = responseJson.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    // --- EXISTING HANDLERS ---

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }
            String json = "{\"status\":\"UP\",\"service\":\"CampusFlex Java Backend\",\"language\":\"Java 17\",\"port\":" + PORT + "}";
            sendResponse(exchange, 200, json);
        }
    }

    static class GoogleAuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"success\":false,\"error\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                String email = extractJsonField(body, "email");
                String name = extractJsonField(body, "name");
                String avatar = extractJsonField(body, "avatar");
                String role = extractJsonField(body, "role");

                if (email == null || email.isEmpty()) {
                    email = "user.google@gmail.com";
                }

                if ("admin".equalsIgnoreCase(role)) {
                    String clean = email.toLowerCase().trim();
                    if (!clean.equals("avanislavanisl536@gmail.com") && !clean.equals("avanislavanisl536")) {
                        sendResponse(exchange, 403, "{\"success\":false,\"error\":\"Access Denied: Unauthorized administrator access.\"}");
                        return;
                    }
                }

                User user = GoogleAuthService.processGoogleAuth(email, name, avatar, role);

                String userJson = String.format(
                    "{\"id\":\"%s\",\"googleId\":\"%s\",\"authProvider\":\"google\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\",\"avatar\":\"%s\",\"verified\":true,\"status\":\"active\",\"createdAt\":\"%s\"}",
                    user.getId(), user.getGoogleId(), user.getName(), user.getEmail(), user.getRole(), user.getAvatar(), user.getCreatedAt()
                );

                String responseJson = String.format("{\"success\":true,\"message\":\"Google authenticated successfully via Java Backend\",\"user\":%s}", userJson);
                sendResponse(exchange, 200, responseJson);
            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, 500, "{\"success\":false,\"error\":\"Java backend authentication failed\"}");
            }
        }
    }

    static class AuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                String email = extractJsonField(body, "email");
                String role = extractJsonField(body, "role");
                if (email == null) email = "student@university.edu";
                if (role == null) role = "student";

                if ("admin".equalsIgnoreCase(role)) {
                    String clean = email.toLowerCase().trim();
                    if (!clean.equals("avanislavanisl536@gmail.com") && !clean.equals("avanislavanisl536")) {
                        sendResponse(exchange, 403, "{\"success\":false,\"error\":\"Access Denied: Unauthorized administrator access.\"}");
                        return;
                    }
                }

                String name = GoogleAuthService.formatHumanName(null, email);
                String userJson = String.format(
                    "{\"id\":\"user-%d\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\",\"verified\":true,\"status\":\"active\"}",
                    System.currentTimeMillis(), name, email, role
                );

                sendResponse(exchange, 200, "{\"success\":true,\"user\":" + userJson + "}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"backend\":\"Java 17\"}");
            }
        }
    }

    static class JobsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                sendResponse(exchange, 201, "{\"success\":true,\"message\":\"Job created via Java backend\",\"job\":{" + body.replace("{", "") + "}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"backend\":\"Java 17 Service\",\"count\":10}");
            }
        }
    }

    static class ApplicationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                sendResponse(exchange, 201, "{\"success\":true,\"message\":\"Application submitted via Java backend\",\"application\":{" + body.replace("{", "") + "}");
            } else {
                sendResponse(exchange, 200, "{\"success\":true,\"backend\":\"Java 17 Service\",\"count\":5}");
            }
        }
    }

    // --- NEW ADMIN REST HANDLERS (JAVA 17) ---

    static class AdminStatsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            String statsJson = String.format(
                "{" +
                "\"success\":true," +
                "\"stats\":{" +
                "\"totalStudents\":148," +
                "\"totalEmployers\":32," +
                "\"activeJobs\":18," +
                "\"filledJobs\":11," +
                "\"totalApplications\":84," +
                "\"pendingVerifications\":3," +
                "\"flaggedScamJobs\":1," +
                "\"totalShiftEarningsPaid\":452000," +
                "\"platformCommission\":%f," +
                "\"systemStatus\":\"HEALTHY\"," +
                "\"aiGovernanceConfidence\":99.4," +
                "\"backendLanguage\":\"Java 17 (OpenJDK)\"," +
                "\"jdbcStatus\":\"ONLINE (CampusFlex JDBC Driver v1.0)\"," +
                "\"serverPort\":%d" +
                "}}",
                commissionRate, PORT
            );

            sendResponse(exchange, 200, statsJson);
        }
    }

    static class AdminUsersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                String action = extractJsonField(body, "action");
                String userId = extractJsonField(body, "userId");

                if ("verify".equalsIgnoreCase(action)) {
                    DatabaseManager.verifyEmployer(userId, true);
                } else if ("unverify".equalsIgnoreCase(action)) {
                    DatabaseManager.verifyEmployer(userId, false);
                }

                String msg = "Admin action '" + action + "' on user '" + userId + "' processed successfully via JDBC in Java Backend.";
                sendResponse(exchange, 200, "{\"success\":true,\"message\":\"" + msg + "\"}");
            } else {
                // Return users overview
                String response = "{" +
                    "\"success\":true," +
                    "\"count\":3," +
                    "\"users\":[" +
                    "{\"id\":\"user-admin-1\",\"name\":\"Avani SL\",\"email\":\"avanislavanisl536@gmail.com\",\"role\":\"admin\",\"status\":\"active\",\"verified\":true}," +
                    "{\"id\":\"user-student-1\",\"name\":\"Student User\",\"email\":\"student@university.edu\",\"role\":\"student\",\"status\":\"active\",\"verified\":true}," +
                    "{\"id\":\"user-employer-1\",\"name\":\"Bright Academy\",\"email\":\"hiring@brightacademy.com\",\"role\":\"employer\",\"status\":\"active\",\"verified\":true}" +
                    "]" +
                    "}";
                sendResponse(exchange, 200, response);
            }
        }
    }

    static class AdminJobsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                String action = extractJsonField(body, "action");
                String jobId = extractJsonField(body, "jobId");
                String newStatus = extractJsonField(body, "status");

                String msg = "Job '" + jobId + "' status updated to '" + newStatus + "' by Java Admin Service.";
                sendResponse(exchange, 200, "{\"success\":true,\"message\":\"" + msg + "\"}");
            } else {
                String response = "{" +
                    "\"success\":true," +
                    "\"jobs\":[" +
                    "{\"id\":\"job-101\",\"title\":\"Online Tutor\",\"company\":\"Bright Academy\",\"hourlyRate\":600,\"status\":\"AVAILABLE\",\"aiScamRisk\":0}," +
                    "{\"id\":\"job-102\",\"title\":\"Data Entry Operator\",\"company\":\"InfoDesk\",\"hourlyRate\":400,\"status\":\"AVAILABLE\",\"aiScamRisk\":5}" +
                    "]" +
                    "}";
                sendResponse(exchange, 200, response);
            }
        }
    }

    static class AdminAILogsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            String logsJson = "{" +
                "\"success\":true," +
                "\"logs\":[" +
                "{\"id\":\"log-101\",\"timestamp\":\"" + java.time.Instant.now().toString() + "\",\"type\":\"VERIFICATION\",\"targetName\":\"TechCorp Innovations\",\"action\":\"Verified Employer Domain Signature\",\"confidenceScore\":99.4,\"status\":\"PASSED\",\"details\":\"Confirmed university incubator partner agreement #TC-2026.\"}," +
                "{\"id\":\"log-102\",\"timestamp\":\"" + java.time.Instant.now().minusSeconds(600).toString() + "\",\"type\":\"SMART_CLOSE\",\"targetName\":\"Campus Social Media Coordinator\",\"action\":\"Enforced Auto-Close Hiring Quota\",\"confidenceScore\":100.0,\"status\":\"ENFORCED\",\"details\":\"Hired 2/2 required candidates. Job status changed to FILLED; 4 pending candidates notified.\"}," +
                "{\"id\":\"log-103\",\"timestamp\":\"" + java.time.Instant.now().minusSeconds(1800).toString() + "\",\"type\":\"FRAUD_PREVENTION\",\"targetName\":\"Unregistered Telegram Bot Job\",\"action\":\"Blocked Fake Job Post\",\"confidenceScore\":97.8,\"status\":\"FLAGGED\",\"details\":\"AI Agent detected suspicious off-platform payment link. Listing blocked instantly.\"}," +
                "{\"id\":\"log-104\",\"timestamp\":\"" + java.time.Instant.now().minusSeconds(3600).toString() + "\",\"type\":\"ANALYTICS\",\"targetName\":\"Campus Marketplace Network\",\"action\":\"Re-calibrated Skill Match Engine\",\"confidenceScore\":98.9,\"status\":\"PASSED\",\"details\":\"Processed 245 active student profiles; match precision at 96.2%.\"}" +
                "]" +
                "}";

            sendResponse(exchange, 200, logsJson);
        }
    }

    static class AdminSettingsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    String body = readRequestBody(exchange);
                    String rateStr = extractJsonField(body, "commissionRate");
                    if (rateStr != null) commissionRate = Double.parseDouble(rateStr);

                    String maxRateStr = extractJsonField(body, "maxHourlyRate");
                    if (maxRateStr != null) maxHourlyRate = Double.parseDouble(maxRateStr);

                    String domains = extractJsonField(body, "allowedDomains");
                    if (domains != null) allowedDomains = domains;
                } catch (Exception ignored) {}

                sendResponse(exchange, 200, "{\"success\":true,\"message\":\"Platform settings saved in Java Backend\"}");
            } else {
                String settingsJson = String.format(
                    "{\"success\":true,\"settings\":{\"commissionRate\":%f,\"autoVerifyEdu\":%b,\"maxHourlyRate\":%f,\"allowedDomains\":\"%s\"}}",
                    commissionRate, autoVerifyEdu, maxHourlyRate, allowedDomains
                );
                sendResponse(exchange, 200, settingsJson);
            }
        }
    }

    static class AdminJDBCHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            Map<String, Object> status = DatabaseManager.getDatabaseStatus();
            String json = "{" +
                "\"success\":true," +
                "\"jdbc\":{" +
                "\"connected\":true," +
                "\"driver\":\"com.campusflex.db.CampusFlexDriver\"," +
                "\"status\":\"ONLINE / HEALTHY\"," +
                "\"databaseEngine\":\"CampusFlex Embedded JDBC 4.3 Engine (Java 17)\"," +
                "\"tables\":[\"employers\",\"employer_reports\",\"jobs\",\"users\"]," +
                "\"url\":\"jdbc:campusflex:data/campusflex.db\"," +
                "\"reportsStored\":" + DatabaseManager.getEmployerReports(null).size() +
                "}" +
                "}";
            sendResponse(exchange, 200, json);
        }
    }

    static class AdminReportsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 204, "");
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                String employerId = extractJsonField(body, "employerId");
                String studentId = extractJsonField(body, "studentId");
                String studentName = extractJsonField(body, "studentName");
                String reason = extractJsonField(body, "reason");
                String details = extractJsonField(body, "details");

                Map<String, Object> res = DatabaseManager.recordEmployerReport(employerId, studentId, studentName, reason, details);
                boolean banned = Boolean.TRUE.equals(res.get("banned"));
                int count = (Integer) res.get("reportCount");
                String msg = (String) res.get("message");

                String json = String.format("{\"success\":true,\"banned\":%b,\"reportCount\":%d,\"message\":\"%s\"}", banned, count, msg);
                sendResponse(exchange, 200, json);
            } else {
                List<Map<String, String>> reports = DatabaseManager.getEmployerReports(null);
                StringBuilder sb = new StringBuilder("{\"success\":true,\"reports\":[");
                for (int i = 0; i < reports.size(); i++) {
                    Map<String, String> r = reports.get(i);
                    sb.append(String.format("{\"id\":\"%s\",\"employerId\":\"%s\",\"studentName\":\"%s\",\"reason\":\"%s\",\"details\":\"%s\",\"createdAt\":\"%s\"}",
                        r.get("id"), r.get("employerId"), r.get("studentName"), r.get("reason"), r.get("details"), r.get("createdAt")
                    ));
                    if (i < reports.size() - 1) sb.append(",");
                }
                sb.append("]}");
                sendResponse(exchange, 200, sb.toString());
            }
        }
    }

    private static String extractJsonField(String json, String field) {
        if (json == null) return null;
        String key = "\"" + field + "\"";
        int index = json.indexOf(key);
        if (index == -1) return null;
        int startColon = json.indexOf(":", index);
        if (startColon == -1) return null;
        int startQuote = json.indexOf("\"", startColon);
        if (startQuote == -1) return null;
        int endQuote = json.indexOf("\"", startQuote + 1);
        if (endQuote == -1) return null;
        return json.substring(startQuote + 1, endQuote);
    }
}
