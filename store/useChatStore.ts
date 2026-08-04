import { create } from 'zustand';
import { ChatMessage, UserRole } from '@/types';
import { MOCK_CHAT_MESSAGES } from '@/lib/mockData';

interface ChatState {
  messages: ChatMessage[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (
    conversationId: string,
    senderId: string,
    receiverId: string,
    senderName: string,
    senderRole: UserRole,
    text: string
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: MOCK_CHAT_MESSAGES,
  activeConversationId: 'conv-alex-techcorp',

  setActiveConversationId: (id: string) => set({ activeConversationId: id }),

  sendMessage: (conversationId, senderId, receiverId, senderName, senderRole, text) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      receiverId,
      senderName,
      senderRole,
      message: text,
      timestamp: new Date().toISOString(),
      read: true,
    };

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));
  },
}));
