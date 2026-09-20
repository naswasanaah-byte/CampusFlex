package com.campusflex.dao;

import com.campusflex.model.Notification;

import java.util.List;

public interface NotificationDAO {
    Notification create(Notification notification);
    List<Notification> findByUserId(Long userId);
    boolean markAsRead(Long notificationId, Long userId);
    boolean markAllAsRead(Long userId);
    int countUnread(Long userId);
}
