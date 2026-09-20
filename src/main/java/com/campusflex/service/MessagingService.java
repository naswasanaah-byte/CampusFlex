package com.campusflex.service;

import com.campusflex.dao.MessageDAO;
import com.campusflex.dao.NotificationDAO;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.Message;
import com.campusflex.model.Notification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagingService {

    private final MessageDAO messageDAO;
    private final NotificationDAO notificationDAO;

    public MessagingService(MessageDAO messageDAO, NotificationDAO notificationDAO) {
        this.messageDAO = messageDAO;
        this.notificationDAO = notificationDAO;
    }

    public Message sendMessage(Long senderId, Long receiverId, Long jobId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ValidationException("Message content cannot be empty.");
        }

        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setJobId(jobId);
        message.setContent(content.trim());

        Message sent = messageDAO.create(message);

        // Send notification
        notificationDAO.create(new Notification(null, receiverId, "New Message 💬",
                "You received a new message.", "MESSAGE"));

        return sent;
    }

    public List<Message> getConversation(Long userId1, Long userId2, Long jobId) {
        messageDAO.markConversationAsRead(userId1, userId2);
        return messageDAO.getConversation(userId1, userId2, jobId);
    }

    public List<Message> getInbox(Long userId) {
        return messageDAO.getUserInbox(userId);
    }

    public int getUnreadCount(Long userId) {
        return messageDAO.countUnreadMessages(userId);
    }
}
