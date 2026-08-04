import { create } from 'zustand';
import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';

interface NotificationState {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,

  addNotification: (notifData) => {
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllAsRead: (userId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
