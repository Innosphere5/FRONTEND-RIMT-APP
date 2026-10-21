import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchNotifications,
  markNotificationAsRead as apiMarkRead,
  markAllNotificationsAsRead as apiMarkAllRead,
  deleteNotification as apiDelete,
  subscribeToRealtimeNotifications,
  simulateNotification,
} from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentStudent } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentAlert, setRecentAlert] = useState(null); // Active in-app banner alert
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const bannerTimerRef = useRef(null);

  const studentRoll = currentStudent?.roll_no || currentStudent?.roll_number || 'anon';

  // Compute unread count helper
  const computeUnread = useCallback((items) => {
    if (!Array.isArray(items)) return 0;
    return items.filter((item) => !item.is_read).length;
  }, []);

  // Display floating banner alert at the header for 6 seconds
  const displayBannerAlert = useCallback((notification) => {
    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }
    setRecentAlert(notification);
    bannerTimerRef.current = setTimeout(() => {
      setRecentAlert(null);
    }, 6500);
  }, []);

  // Dismiss floating banner alert manually
  const dismissAlert = useCallback(() => {
    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }
    setRecentAlert(null);
  }, []);

  // Load notifications from cloud/cache
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchNotifications(studentRoll);
      if (res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadCount(computeUnread(res.notifications));
      }
    } catch (e) {
      console.warn('[NotificationContext] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [studentRoll, computeUnread]);

  // Initial load when studentRoll changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Handle incoming real-time notification
  const handleIncomingNotification = useCallback(
    (newNotif) => {
      if (!newNotif || !newNotif.id) return;

      // Parse JSONB 'data' field if it arrives as a string from Supabase Realtime
      let parsedData = newNotif.data;
      if (parsedData && typeof parsedData === 'string') {
        try { parsedData = JSON.parse(parsedData); } catch { /* keep as-is */ }
      }

      const formatted = {
        ...newNotif,
        data: parsedData || {},
        is_read: false,
        created_at: newNotif.created_at || new Date().toISOString(),
      };

      setNotifications((prev) => {
        // Prevent duplicate injection
        const exists = prev.some((item) => item.id === formatted.id);
        if (exists) return prev;
        const updated = [formatted, ...prev];
        setUnreadCount(computeUnread(updated));
        return updated;
      });

      // Trigger animated in-app header alert immediately
      displayBannerAlert(formatted);
    },
    [computeUnread, displayBannerAlert]
  );

  // Subscribe to live PostgreSQL replication via Supabase Realtime
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeNotifications((newNotif) => {
      handleIncomingNotification(newNotif);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [handleIncomingNotification]);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      setNotifications((prev) => {
        const updated = prev.map((item) =>
          item.id === notificationId ? { ...item, is_read: true } : item
        );
        setUnreadCount(computeUnread(updated));
        return updated;
      });
      await apiMarkRead(notificationId, studentRoll);
    },
    [studentRoll, computeUnread]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const allIds = notifications.map((n) => n.id);
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, is_read: true }));
      setUnreadCount(0);
      return updated;
    });
    await apiMarkAllRead(allIds, studentRoll);
  }, [notifications, studentRoll]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      setNotifications((prev) => {
        const updated = prev.filter((item) => item.id !== notificationId);
        setUnreadCount(computeUnread(updated));
        return updated;
      });
      await apiDelete(notificationId);
    },
    [computeUnread]
  );

  // Simulation trigger helper for interactive demoing & testing
  const triggerSimulatedNotification = useCallback(
    async (type = 'internship', customData = {}) => {
      const notif = await simulateNotification(type, customData);
      if (notif) {
        handleIncomingNotification(notif);
      }
      return notif;
    },
    [handleIncomingNotification]
  );

  const value = {
    notifications,
    unreadCount,
    recentAlert,
    isLoading,
    isLiveConnected,
    displayBannerAlert,
    dismissAlert,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications,
    triggerSimulatedNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
