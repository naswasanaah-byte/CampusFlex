package com.campusflex.dao;

import com.campusflex.model.Message;

import java.util.List;

public interface MessageDAO {
    Message create(Message message);
    List<Message> getConversation(Long userId1, Long userId2, Long jobId);
    List<Message> getUserInbox(Long userId);
    boolean markConversationAsRead(Long receiverId, Long senderId);
    int countUnreadMessages(Long userId);
}
