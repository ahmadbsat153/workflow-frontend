 
import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "../api/_axios";
import { NOTIFICATION_ENDPOINTS } from "../constants/endpoints";
import type {
  GetNotificationsResponse,
  UnreadCountResponse,
  NotificationActionResponse,
  GetPreferencesResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  NotificationQueryParams,
} from "../types/notification";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_NOTIFICATION {
  /**
   * Get paginated notifications
   * @param params Query parameters (page, limit, unreadOnly, type)
   */
  export async function getAll(params?: NotificationQueryParams) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.unreadOnly !== undefined) {
        queryParams.append("unreadOnly", params.unreadOnly.toString());
      }
      if (params?.type && params.type !== "all") {
        queryParams.append("type", params.type);
      }

      const queryString = queryParams.toString();
      const url = `${NOTIFICATION_ENDPOINTS.GET_ALL}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await _axios.get(url);
      return response.data as GetNotificationsResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get unread notification count for badge
   */
  export async function getUnreadCount() {
    try {
      const response = await _axios.get(NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT);
      return response.data as UnreadCountResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Mark a single notification as read
   * @param id Notification ID
   */
  export async function markAsRead(id: string) {
    try {
      const response = await _axios.patch(
        build_path(NOTIFICATION_ENDPOINTS.MARK_READ, { id })
      );
      return response.data as NotificationActionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  export async function markAllAsRead() {
    try {
      const response = await _axios.patch(
        NOTIFICATION_ENDPOINTS.MARK_ALL_READ
      );
      return response.data as NotificationActionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Delete (soft delete) a notification
   * @param id Notification ID
   */
  export async function deleteNotification(id: string) {
    try {
      const response = await _axios.delete(
        build_path(NOTIFICATION_ENDPOINTS.DELETE, { id })
      );
      return response.data as NotificationActionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get user's notification preferences
   */
  export async function getPreferences() {
    try {
      const response = await _axios.get(NOTIFICATION_ENDPOINTS.GET_PREFERENCES);
      return response.data as GetPreferencesResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Update user's notification preferences
   * @param data Preferences to update
   */
  export async function updatePreferences(data: UpdatePreferencesRequest) {
    try {
      const response = await _axios.patch(
        NOTIFICATION_ENDPOINTS.UPDATE_PREFERENCES,
        data
      );
      return response.data as UpdatePreferencesResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
