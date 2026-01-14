import { _axios, handleErrors } from "@/lib/api/_axios";
import {
  Position,
  PositionOption,
  PositionTable,
} from "@/lib/types/position/position";
import { POSITION_ENDPOINTS } from "@/lib/constants/endpoints";
import { build_path } from "@/utils/common";
import { SuccessResponse } from "@/lib/types/common";

export namespace API_POSITION {
  export async function getAllPositions(query?: string) {
    try {
      let request = `${POSITION_ENDPOINTS.GET_ALL}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as PositionTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getActivePositions(query?: string) {
    try {
      let request = `${POSITION_ENDPOINTS.GET_ACTIVE}`;
      if (query) request = request + query;
      const response = await _axios.get(request);
      return response.data as { data: PositionOption[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getPositionById(id: string) {
    try {
      const response = await _axios.get(
        build_path(POSITION_ENDPOINTS.GET_ID, { id })
      );
      return response.data.data as Position;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getPositionUsers(id: string) {
    try {
      const response = await _axios.get(
        build_path(POSITION_ENDPOINTS.GET_USERS, { id })
      );
      return response.data as { data: any[] };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createPosition(data: any) {
    try {
      const response = await _axios.post(POSITION_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updatePosition(id: string, data: any) {
    try {
      const response = await _axios.put<SuccessResponse>(
        build_path(POSITION_ENDPOINTS.UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function deletePosition(id: string) {
    try {
      const response = await _axios.delete(
        build_path(POSITION_ENDPOINTS.DELETE, { id })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
