"use client";

import {
  BellIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { useRouter } from "next/navigation";
import { URLs } from "@/lib/constants/urls";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/lib/ui/separator";
import { ScrollArea } from "@/lib/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/lib/context/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import type { Notification, NotificationType } from "@/lib/types/notification";

/**
 * Get display title for notification
 * For approval_request type, shows different title based on whether user is a notification receiver
 */
const getNotificationTitle = (notification: Notification): string => {
  if (
    notification.type === "approval_request" &&
    notification.metadata?.isNotificationReceiver
  ) {
    return "Approval Notification";
  }
  return notification.title;
};

/**
 * Get appropriate icon for each notification type
 */
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "form_submission":
      return <DocumentTextIcon className="size-5 text-blue-500" />;
    case "approval_request":
      return <ClockIcon className="size-5 text-yellow-500" />;
    case "approval_decision":
      return <CheckCircleIcon className="size-5 text-green-500" />;
    case "workflow_completed":
      return <CheckCircleIcon className="size-5 text-green-500" />;
    case "workflow_failed":
      return <ExclamationTriangleIcon className="size-5 text-red-500" />;
    default:
      return <BellIcon className="size-5 text-gray-500" />;
  }
};

/**
 * Individual notification item in the dropdown
 */
const NotificationItem = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification._id ?? notification.id);
    }
    onClose();

    // For notification receivers, append viewOnly param to indicate they can only view
    let targetUrl = notification.actionUrl;
    if (notification.metadata?.isNotificationReceiver) {
      const separator = targetUrl.includes("?") ? "&" : "?";
      targetUrl = `${targetUrl}${separator}viewOnly=true`;
    }
    router.push(targetUrl);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification._id ?? notification.id);
  };

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
        !notification.read ? "bg-blue-300/30 dark:bg-blue-950/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm ${
                !notification.read ? "font-semibold" : "font-medium"
              }`}
            >
              {getNotificationTitle(notification)}
            </p>
            <Button
              onClick={handleDelete}
              variant={"ghost"}
              className="flex-shrink-0 hover:text-destructive transition-colors"
              aria-label="Delete notification"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Notification Bell component with dropdown
 * Shows unread count badge and displays recent notifications
 */
export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const router = useRouter();
  const { notifications, unreadCount, loading, markAllAsRead } =
    useNotifications();
  const prevUnreadCountRef = useRef(unreadCount);

  // Trigger blink animation when a new notification arrives
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      setIsBlinking(true);
      const timer = setTimeout(() => {
        setIsBlinking(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push(URLs.app.notifications.index);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={`relative p-2 hover:bg-muted rounded-md transition-colors  `}
          aria-label="Notifications"
        >
          <BellIcon
            className={`size-5 text-foreground ${
              isBlinking ? "animate-bounce" : ""
            } `}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-7"
              >
                <CheckIcon className="size-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <BellIcon className="size-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div>
              {notifications.slice(0, 10).map((notification) => (
                <div key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onClose={() => setOpen(false)}
                  />
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewAll}
                className="w-full text-xs"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
