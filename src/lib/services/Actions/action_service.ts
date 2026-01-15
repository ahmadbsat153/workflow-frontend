import { _axios, handleErrors } from "@/lib/api/_axios";
import { Action, ActionList, ActionTable } from "@/lib/types/actions/action";
import { ACTION_ENDPOINTS } from "@/lib/constants/endpoints";
import { build_path } from "@/utils/common";
import { SuccessResponse } from "@/lib/types/common";
import { ActionFormValues } from "@/utils/Validation/actionValidationSchema";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_ACTION {
  export async function getAllActions(query?: string) {
    try {
      let request = `${ACTION_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as ActionTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getActiveActions(query?: string) {
    try {
      let request = `${ACTION_ENDPOINTS.ACTIVE}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as ActionList;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getActionById(id: string) {
    try {
      const response = await _axios.get(
        build_path(ACTION_ENDPOINTS.GET_ID, { id })
      );
      return response.data as Action;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createAction(data: ActionFormValues) {
    try {
      const response = await _axios.post(ACTION_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateAction(id: string, data: ActionFormValues) {
    try {
      const response = await _axios.put(
        build_path(ACTION_ENDPOINTS.UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
