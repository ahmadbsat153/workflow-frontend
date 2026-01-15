 
import { handleErrors, _axios } from "../api/_axios";
import { PROFILE_ENDPOINTS } from "../constants/endpoints";
import { SuccessResponse } from "../types/common";
import {
  Profile,
  ProfileUpdateData,
  ChangePasswordData,
  ProfileStatistics,
} from "../types/profile";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_PROFILE {
  export async function getProfile() {
    try {
      const response = await _axios.get(PROFILE_ENDPOINTS.GET_PROFILE);
      return response.data as { success: boolean; data: Profile };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateProfile(data: ProfileUpdateData) {
    try {
      const response = await _axios.put(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
      return response.data as { success: boolean; message: string; data: Profile };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function changePassword(data: ChangePasswordData) {
    try {
      const response = await _axios.post(
        PROFILE_ENDPOINTS.CHANGE_PASSWORD,
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getStatistics() {
    try {
      const response = await _axios.get(PROFILE_ENDPOINTS.GET_STATISTICS);
      return response.data as { success: boolean; data: ProfileStatistics };
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
