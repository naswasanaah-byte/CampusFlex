package com.campusflex;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.campusflex.service.GoogleAuthService;
import com.campusflex.model.User;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class CampusFlexServer {

    private static final int PORT = 8080;
    private static final List<String> mockUsersJson = new ArrayList<>();
    private static final List<String> mockJobsJson = new ArrayList<>();
    private static final List<String> mockApplicationsJson = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        int serverPort = PORT;
        String envPort = System.getenv("JAVA_BACKEND_PORT");
        if (envPort != null && !envPort.isEmpty()) {
            try {
                serverPort = Integer.parseInt(envPort);
            } catch (NumberFormatException ignored) {}
        }

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", serverPort), 0);

        // CORS & JSON Middleware Handler Wrapper
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/auth/google", new GoogleAuthHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/jobs", new JobsHandler());
        server.createContext("/api/applications", new ApplicationsHandler());

        server.setExecutor(null); // default executor
        System.out.println("🚀 [CampusFlex Java Backend] Server started on port " + serverPort + " (Java 17)");
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

    // --- HANDLERS ---

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
