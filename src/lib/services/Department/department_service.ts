import { _axios, handleErrors } from "@/lib/api/_axios";
import {
  Department,
  DepartmentOption,
  DepartmentTable,
} from "@/lib/types/department/department";
import { DEPARTMENT_ENDPOINTS } from "@/lib/constants/endpoints";
import { build_path } from "@/utils/common";
import { SuccessResponse } from "@/lib/types/common";
import { DepartmentFormValues } from "@/lib/components/Pages/Departments/DepartmentForm";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_DEPARTMENT {
  export async function getAllDepartments(query?: string) {
    try {
      let request = `${DEPARTMENT_ENDPOINTS.GET_ALL}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as DepartmentTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getActiveDepartments(query?: string) {
    try {
      let request = `${DEPARTMENT_ENDPOINTS.GET_ACTIVE}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as { data: DepartmentOption[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getDepartmentById(id: string) {
    try {
      const response = await _axios.get(
        build_path(DEPARTMENT_ENDPOINTS.GET_ID, { id })
      );
      return response.data.data as Department;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getDepartmentHierarchy() {
    try {
      const response = await _axios.get(DEPARTMENT_ENDPOINTS.GET_HIERARCHY);
      return response.data as { data: Department[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createDepartment(data: DepartmentFormValues) {
    try {
      const response = await _axios.post(DEPARTMENT_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateDepartment(id: string, data: DepartmentFormValues) {
    try {
      const response = await _axios.put(
        build_path(DEPARTMENT_ENDPOINTS.UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function deleteDepartment(id: string) {
    try {
      const response = await _axios.delete(
        build_path(DEPARTMENT_ENDPOINTS.DELETE, { id })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
