import { _axios, handleErrors } from "@/lib/api/_axios";
import { Branch, BranchOption, BranchTable } from "@/lib/types/branch/branch";
import { BRANCH_ENDPOINTS } from "@/lib/constants/endpoints";
import { build_path } from "@/utils/common";
import { SuccessResponse } from "@/lib/types/common";
import { User } from "@/lib/types/user/user";
import { BranchFormValues } from "@/utils/Validation/branchValidationScehma";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_BRANCH {
  export async function getAllBranches(query?: string) {
    try {
      let request = `${BRANCH_ENDPOINTS.GET_ALL}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as BranchTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getActiveBranches(query?: string) {
    try {
      let request = `${BRANCH_ENDPOINTS.GET_ACTIVE}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as { data: BranchOption[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getBranchById(id: string) {
    try {
      const response = await _axios.get(
        build_path(BRANCH_ENDPOINTS.GET_ID, { id })
      );
      return response.data.data as Branch;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getBranchUsers(id: string) {
    try {
      const response = await _axios.get(
        build_path(BRANCH_ENDPOINTS.GET_USERS, { id })
      );
      return response.data as { data: User[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createBranch(data: BranchFormValues) {
    try {
      const response = await _axios.post(BRANCH_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateBranch(id: string, data: BranchFormValues) {
    try {
      const response = await _axios.patch(
        build_path(BRANCH_ENDPOINTS.UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function deleteBranch(id: string) {
    try {
      const response = await _axios.delete(
        build_path(BRANCH_ENDPOINTS.DELETE, { id })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
