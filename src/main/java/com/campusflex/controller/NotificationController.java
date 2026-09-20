package com.campusflex.controller;

import com.campusflex.exception.AuthenticationException;
import com.campusflex.model.Notification;
import com.campusflex.model.User;
import com.campusflex.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    private User getAuthenticatedUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to view notifications.");
        }
        return user;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(HttpSession session) {
        User user = getAuthenticatedUser(session);
        List<Notification> list = notificationService.getUserNotifications(user.getId());
        int unread = notificationService.getUnreadCount(user.getId());

        Map<String, Object> res = new HashMap<>();
        res.put("notifications", list);
        res.put("unreadCount", unread);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable Long id, HttpSession session) {
        User user = getAuthenticatedUser(session);
        notificationService.markAsRead(id, user.getId());

        Map<String, String> res = new HashMap<>();
        res.put("message", "Notification marked as read.");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllRead(HttpSession session) {
        User user = getAuthenticatedUser(session);
        notificationService.markAllAsRead(user.getId());

        Map<String, String> res = new HashMap<>();
        res.put("message", "All notifications marked as read.");
        return ResponseEntity.ok(res);
    }
}
