package com.campusflex.service;

import com.campusflex.dao.NotificationDAO;
import com.campusflex.model.Notification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationDAO notificationDAO;

    public NotificationService(NotificationDAO notificationDAO) {
        this.notificationDAO = notificationDAO;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationDAO.findByUserId(userId);
    }

    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationDAO.markAsRead(notificationId, userId);
    }

    public boolean markAllAsRead(Long userId) {
        return notificationDAO.markAllAsRead(userId);
    }

    public int getUnreadCount(Long userId) {
        return notificationDAO.countUnread(userId);
    }
}
