/**
 * Notification Types and Interfaces
 *
 * Defines all types related to the notification system including
 * notification objects, preferences, and API responses.
 */

/**
 * Supported notification types
 */
export type NotificationType =
  | 'form_submission'
  | 'approval_request'
  | 'approval_decision'
  | 'workflow_completed'
  | 'workflow_failed';

/**
 * Notification metadata structure
 * Contains additional context specific to each notification type
 */
export interface NotificationMetadata {
  submissionId?: string;
  formId?: string;
  formName?: string;
  submittedBy?: string;
  submittedByName?: string;
  approvalStage?: string;
  decision?: string;
  workflowStatus?: string;
  customData?: unknown;
}

/**
 * Main notification object structure
 */
export interface Notification {
  _id?: string;
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  actionUrl: string;
  read: boolean;
  readAt: Date | null;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination metadata for notification lists
 */
export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Response structure for GET /api/v1/notifications
 */
export interface GetNotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: NotificationPagination;
}

/**
 * Response structure for GET /api/v1/notifications/unread-count
 */
export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

/**
 * Response structure for single notification operations
 */
export interface NotificationActionResponse {
  success: boolean;
  message: string;
  count?: number;
}

/**
 * Notification preferences for a single notification type
 */
export interface NotificationTypePreference {
  inApp: boolean;
  email: boolean;
}

/**
 * Complete notification preferences structure
 */
export interface NotificationPreferences {
  form_submission: NotificationTypePreference;
  approval_request: NotificationTypePreference;
  approval_decision: NotificationTypePreference;
  workflow_completed: NotificationTypePreference;
  workflow_failed: NotificationTypePreference;
}

/**
 * Response structure for GET /api/v1/notifications/preferences
 */
export interface GetPreferencesResponse {
  success: boolean;
  data: {
    userId: string;
    preferences: NotificationPreferences;
  };
}

/**
 * Request body for PATCH /api/v1/notifications/preferences
 */
export interface UpdatePreferencesRequest {
  preferences: NotificationPreferences;
}

/**
 * Response structure for PATCH /api/v1/notifications/preferences
 */
export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    preferences: NotificationPreferences;
  };
}

/**
 * Socket.IO event payloads
 */

/**
 * Payload for 'connected' event
 */
export interface SocketConnectedPayload {
  success: boolean;
  message: string;
  userId: string;
}

/**
 * Payload for 'notification:updated' event
 */
export interface SocketNotificationUpdatedPayload {
  id: string;
  read: boolean;
}

/**
 * Payload for 'notification:all-read' event
 */
export interface SocketNotificationAllReadPayload {
  count: number;
}

/**
 * Payload for 'notification:deleted' event
 */
export interface SocketNotificationDeletedPayload {
  id: string;
}

/**
 * Payload for 'pong' event
 */
export interface SocketPongPayload {
  timestamp: number;
}

/**
 * Query parameters for fetching notifications
 */
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType | 'all';
}
