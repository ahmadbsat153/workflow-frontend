"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  TrashIcon,
  CheckIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { API_NOTIFICATION } from "@/lib/services/notification_service";
import { Button } from "@/lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Separator } from "@/lib/ui/separator";
import { Badge } from "@/lib/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import { Skeleton } from "@/lib/ui/skeleton";
import type { Notification, NotificationType } from "@/lib/types/notification";

/**
 * Get appropriate icon for each notification type
 */
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "form_submission":
      return <DocumentTextIcon className="size-6 text-blue-500" />;
    case "approval_request":
      return <ClockIcon className="size-6 text-yellow-500" />;
    case "approval_decision":
      return <CheckCircleIcon className="size-6 text-green-500" />;
    case "workflow_completed":
      return <CheckCircleIcon className="size-6 text-green-500" />;
    case "workflow_failed":
      return <ExclamationTriangleIcon className="size-6 text-red-500" />;
    default:
      return <BellIcon className="size-6 text-gray-500" />;
  }
};

/**
 * Get human-readable label for notification type
 */
const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case "form_submission":
      return "Form Submission";
    case "approval_request":
      return "Approval Request";
    case "approval_decision":
      return "Approval Decision";
    case "workflow_completed":
      return "Workflow Completed";
    case "workflow_failed":
      return "Workflow Failed";
    default:
      return type;
  }
};

/**
 * Individual notification card
 */
const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    router.push(notification.actionUrl);
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        !notification.read ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/10" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4
                  className={`text-sm ${
                    !notification.read ? "font-semibold" : "font-medium"
                  }`}
                >
                  {notification.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(notification.type)}
                </Badge>
                {!notification.read && (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="h-7"
                  >
                    <CheckIcon className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="h-7 text-destructive hover:text-destructive"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {notification.metadata.formName && (
                <span>Form: {notification.metadata.formName}</span>
              )}
              {notification.metadata.submittedByName && (
                <span>By: {notification.metadata.submittedByName}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Loading skeleton for notifications
 */
const NotificationSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="size-6 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Main Notifications Page
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  const limit = 20;

  // Normalize notification data (handle both id and _id)
  const normalizeNotification = (notification: any): Notification => {
    return {
      ...notification,
      id: notification.id || notification._id,
    };
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API_NOTIFICATION.getAll({
        page,
        limit,
        type: filterType,
        unreadOnly: filterRead === "unread" ? true : undefined,
      });

      console.log("Fetched notifications:", response.data);
      console.log("First notification:", response.data[0]);

      // Normalize and filter by read status if needed
      let filteredData = response.data.map(normalizeNotification);
      if (filterRead === "read") {
        filteredData = filteredData.filter((n) => n.read);
      }

      setNotifications(filteredData);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterType, filterRead]);

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await API_NOTIFICATION.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await API_NOTIFICATION.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date() }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      await API_NOTIFICATION.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage your notifications and stay updated
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckIcon className="size-4 mr-2" />
              Mark all as read ({unreadCount})
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <FunnelIcon className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Tabs
            value={filterRead}
            onValueChange={(value) =>
              setFilterRead(value as "all" | "unread" | "read")
            }
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={filterType}
            onValueChange={(value) =>
              setFilterType(value as NotificationType | "all")
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="form_submission">Form Submissions</SelectItem>
              <SelectItem value="approval_request">Approval Requests</SelectItem>
              <SelectItem value="approval_decision">Approval Decisions</SelectItem>
              <SelectItem value="workflow_completed">Workflow Completed</SelectItem>
              <SelectItem value="workflow_failed">Workflow Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellIcon className="size-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground text-center">
                You don&apos;t have any notifications matching the selected filters
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
