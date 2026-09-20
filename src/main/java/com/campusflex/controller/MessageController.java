package com.campusflex.controller;

import com.campusflex.exception.AuthenticationException;
import com.campusflex.model.Message;
import com.campusflex.model.User;
import com.campusflex.service.MessagingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessagingService messagingService;

    public MessageController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    private User getAuthenticatedUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to use messaging.");
        }
        return user;
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> body, HttpSession session) {
        User user = getAuthenticatedUser(session);
        Long receiverId = Long.parseLong(body.get("receiverId").toString());
        Long jobId = body.get("jobId") != null ? Long.parseLong(body.get("jobId").toString()) : null;
        String content = (String) body.get("content");

        Message msg = messagingService.sendMessage(user.getId(), receiverId, jobId, content);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long otherUserId,
            @RequestParam(required = false) Long jobId,
            HttpSession session) {

        User user = getAuthenticatedUser(session);
        return ResponseEntity.ok(messagingService.getConversation(user.getId(), otherUserId, jobId));
    }

    @GetMapping("/inbox")
    public ResponseEntity<Map<String, Object>> getInbox(HttpSession session) {
        User user = getAuthenticatedUser(session);
        List<Message> inbox = messagingService.getInbox(user.getId());
        int unread = messagingService.getUnreadCount(user.getId());

        Map<String, Object> res = new HashMap<>();
        res.put("messages", inbox);
        res.put("unreadCount", unread);
        return ResponseEntity.ok(res);
    }
}
