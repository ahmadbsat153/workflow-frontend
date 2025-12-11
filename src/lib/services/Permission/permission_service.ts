import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "@/lib/api/_axios";
import { PERMISSION_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  UserPermissions,
  PermissionOverridePayload,
} from "@/lib/types/role/role";
import type { SuccessResponse } from "@/lib/types/common";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_PERMISSION {
  /**
   * Get user's permission breakdown (role permissions + granted + denied)
   */
  export async function getUserPermissions(userId: string) {
    try {
      const response = await _axios.get(
        build_path(PERMISSION_ENDPOINTS.GET_USER_PERMISSIONS, { id: userId })
      );
      return response.data.data as UserPermissions;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Grant specific permissions to a user (override)
   */
  export async function grantUserPermissions(
    userId: string,
    payload: PermissionOverridePayload
  ) {
    try {
      const response = await _axios.post(
        build_path(PERMISSION_ENDPOINTS.GRANT_USER_PERMISSIONS, { id: userId }),
        payload
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Deny specific permissions for a user (override)
   */
  export async function denyUserPermissions(
    userId: string,
    payload: PermissionOverridePayload
  ) {
    try {
      const response = await _axios.post(
        build_path(PERMISSION_ENDPOINTS.DENY_USER_PERMISSIONS, { id: userId }),
        payload
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Clear all custom permissions for a user (reset to role defaults)
   */
  export async function clearUserCustomPermissions(userId: string) {
    try {
      const response = await _axios.delete(
        build_path(PERMISSION_ENDPOINTS.CLEAR_USER_PERMISSIONS, { id: userId })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Update user's role
   */
  export async function updateUserRole(userId: string, roleId: string) {
    try {
      const response = await _axios.patch(
        build_path(PERMISSION_ENDPOINTS.UPDATE_USER_ROLE, { id: userId }),
        { roleId }
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
