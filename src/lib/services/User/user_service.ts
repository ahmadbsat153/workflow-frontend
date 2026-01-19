/* eslint-disable @typescript-eslint/no-explicit-any */
import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "../../api/_axios";
import { ADUSER_ENDPOINTS, AUTH_ENDPOINTS, USER_ENDPOINTS } from "../../constants/endpoints";
import { SuccessResponse } from "../../types/common";
import { ADUserTable, User, UserTable } from "../../types/user/user";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_USER {
  export async function getAllUsers(query?: string) {
    try {
      let request = `${USER_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as UserTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getUserById(id: string) {
    try {
      const response = await _axios.get(
        build_path(USER_ENDPOINTS.GET_ID, { id })
      );
      return response.data as User;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createUser(data: any) {
    try {
      const response = await _axios.post(USER_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateUserById(id: string, data: any) {
    try {
      const response = await _axios.patch(
        build_path(USER_ENDPOINTS.ADMIN_UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function deleteUser() {
    try {
      const response = await _axios.delete(USER_ENDPOINTS.DELETE);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function changePassword(data: any) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.UPDATE_PASSWORD, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function adminDeleteUser(id: string) {
    try {
      const response = await _axios.delete(
        build_path(USER_ENDPOINTS.DELETE, { id })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getUserAnalytics(id: string) {
    try {
      const response = await _axios.get(
        build_path(USER_ENDPOINTS.GET_ANALYTICS, { id })
      );
      return response.data as User;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  // ============================================================
  // USER FROM ACTIVE DIRECTORY MANAGEMENT
  // ============================================================

  export async function getActiveADUsers(query?: string) {
    try {
      let request = `${ADUSER_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as ADUserTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export type BulkSyncOptions = {
    createNewUsers?: boolean;
    defaultRoleCode?: string;
  };

  export type BulkSyncResult = {
    synced: number;
    created: number;
    updated: number;
    managersLinked: number;
    errors: number;
    details: {
      created: string[];
      updated: string[];
      managersLinked: string[];
      failed: { email: string; reason: string }[];
    };
  };

  /**
   * Bulk sync AD users with their managers
   */
  export async function bulkSyncADUsersWithManager(
    options?: BulkSyncOptions
  ): Promise<BulkSyncResult> {
    try {
      const response = await _axios.post(ADUSER_ENDPOINTS.BULK_SYNC, {
        createNewUsers: options?.createNewUsers ?? true,
        defaultRoleCode: options?.defaultRoleCode ?? "TEAM_MEMBER",
      });
      return response.data.data as BulkSyncResult;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
