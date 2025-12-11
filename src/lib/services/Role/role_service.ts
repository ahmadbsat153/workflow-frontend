import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "@/lib/api/_axios";
import { ROLE_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  Role,
  RoleTable,
  RoleWithPermissions,
  CreateRolePayload,
  UpdateRolePayload,
  PermissionGroup,
} from "@/lib/types/role/role";
import type { SuccessResponse } from "@/lib/types/common";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_ROLE {
  /**
   * Get all roles with pagination
   */
  export async function getAllRoles(query?: string) {
    try {
      let request = `${ROLE_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as RoleTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get all active roles (for dropdowns)
   */
  export async function getActiveRoles() {
    try {
      const response = await _axios.get(ROLE_ENDPOINTS.GET_ACTIVE);
      return response.data.data as Role[];
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get role by ID
   */
  export async function getRoleById(id: string) {
    try {
      const response = await _axios.get(build_path(ROLE_ENDPOINTS.GET_ID, { id }));
      return response.data.data as RoleWithPermissions;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get role by name/code
   */
  export async function getRoleByName(name: string) {
    try {
      const response = await _axios.get(build_path(ROLE_ENDPOINTS.GET_NAME, { name }));
      return response.data.data as RoleWithPermissions;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Create a new role
   */
  export async function createRole(payload: CreateRolePayload) {
    try {
      const response = await _axios.post(ROLE_ENDPOINTS.CREATE, payload);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Update a role
   */
  export async function updateRole(id: string, payload: UpdateRolePayload) {
    try {
      const response = await _axios.put(
        build_path(ROLE_ENDPOINTS.UPDATE, { id }),
        payload
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Delete a role
   */
  export async function deleteRole(id: string) {
    try {
      const response = await _axios.delete(build_path(ROLE_ENDPOINTS.DELETE, { id }));
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get all available permissions grouped by module
   */
  export async function getAvailablePermissions(groupByModule = true) {
    try {
      const url = `${ROLE_ENDPOINTS.GET_PERMISSIONS_AVAILABLE}?groupByModule=${groupByModule}`;
      const response = await _axios.get(url);
      return response.data.data as PermissionGroup;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
