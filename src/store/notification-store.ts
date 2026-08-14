// stores/notification-store.ts
import { NotificationDto } from '@/shared/api/types';
import { create } from 'zustand';

interface NotificationState {
  notifications: NotificationDto[];
  unreadCount: number;
  isConnected: boolean;

  addNotification: (n: NotificationDto) => void;
  setNotifications: (list: NotificationDto[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setConnected: (status: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + (n.status === 'UNREAD' ? 1 : 0),
    })),

  setNotifications: (list) =>
    set({
      notifications: list,
      unreadCount: list.filter((n) => n.status === 'UNREAD').length,
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id && n.status === 'UNREAD' ? { ...n, status: 'READ' as const } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => n.status === 'UNREAD').length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, status: 'READ' as const })),
      unreadCount: 0,
    })),

  setConnected: (status) => set({ isConnected: status }),
}));