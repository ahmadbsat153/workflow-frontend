"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { API_NOTIFICATION } from "../services/notification_service";
import type {
  Notification,
  SocketConnectedPayload,
  SocketNotificationUpdatedPayload,
  SocketNotificationAllReadPayload,
  SocketNotificationDeletedPayload,
} from "../types/notification";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  connected: boolean;
  loading: boolean;
  fetchNotifications: (limit?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const TOKEN_KEY = "AFW_token";

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    try {
      const parsedToken = JSON.parse(token);
      const backendHost =
        process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:8080";

      // Create Socket.IO connection
      socketRef.current = io(backendHost, {
        auth: {
          token: `Bearer ${parsedToken}`,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Connection events
      socketRef.current.on("connect", () => {
        console.log("Socket.IO connected");
        setConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket.IO disconnected");
        setConnected(false);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
        setConnected(false);
      });

      // Connected event with user info
      socketRef.current.on("connected", (data: SocketConnectedPayload) => {
        console.log("Socket.IO authenticated:", data);
      });

      // New notification received
      socketRef.current.on("notification:new", (notification: Notification) => {
        console.log("New notification received:", notification);

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev]);

        // Increment unread count
        setUnreadCount((prev) => prev + 1);
      });

      // Notification marked as read
      socketRef.current.on(
        "notification:updated",
        (data: SocketNotificationUpdatedPayload) => {
          console.log("Notification updated:", data);

          // Update notification in list
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === data.id
                ? { ...n, read: data.read, readAt: new Date() }
                : n
            )
          );

          // Decrement unread count if marked as read
          if (data.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      );

      // All notifications marked as read
      socketRef.current.on(
        "notification:all-read",
        (data: SocketNotificationAllReadPayload) => {
          console.log("All notifications marked as read:", data);

          // Update all notifications
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true, readAt: new Date() }))
          );

          // Reset unread count
          setUnreadCount(0);
        }
      );

      // Notification deleted
      socketRef.current.on(
        "notification:deleted",
        (data: SocketNotificationDeletedPayload) => {
          console.log("Notification deleted:", data);

          // Remove notification from list and update unread count
          setNotifications((prev) => {
            // Find the notification being deleted
            const deletedNotification = prev.find((n) => n.id === data.id);

            // Decrement unread count if notification was unread
            if (deletedNotification && !deletedNotification.read) {
              setUnreadCount((count) => Math.max(0, count - 1));
            }

            // Return filtered list
            return prev.filter((n) => n.id !== data.id);
          });
        }
      );

      // Pong event (health check response)
      socketRef.current.on("pong", (data: { timestamp: number }) => {
        console.log("Pong received:", data);
      });

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to initialize Socket.IO:", error);
    }
  }, []);

  // Fetch notifications (for dropdown/initial load)
  const fetchNotifications = async (limit: number = 10) => {
    try {
      setLoading(true);
      const response = await API_NOTIFICATION.getAll({ limit, page: 1 });
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await API_NOTIFICATION.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await API_NOTIFICATION.markAsRead(id);
      // Update will be handled by Socket.IO event
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await API_NOTIFICATION.markAllAsRead();
      // Update will be handled by Socket.IO event
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await API_NOTIFICATION.deleteNotification(id);
      // Update will be handled by Socket.IO event
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Refresh notifications and unread count
  const refreshNotifications = async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  };

  // Initial fetch on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      refreshNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
