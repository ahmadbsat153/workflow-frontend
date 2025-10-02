/* eslint-disable @typescript-eslint/no-explicit-any */
import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "../../api/_axios";
import { FORM_ENDPOINTS } from "../../constants/endpoints";
import { SuccessResponse } from "../../types/common";
import { Form, FormDetails, FormList } from "@/lib/types/form/form";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_FORM {
  export async function getAllForms(query?: string) {
    try {
      let request = `${FORM_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as FormList;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getFormById(id: string) {
    try {
      const response = await _axios.get(
        build_path(FORM_ENDPOINTS.GET_ID, { id })
      );
      return response.data as Form;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function createForm(data: any) {
    try {
      const response = await _axios.post(FORM_ENDPOINTS.CREATE, data);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function updateFormById(id: string, data: any) {
    try {
      const response = await _axios.patch(
        build_path(FORM_ENDPOINTS.UPDATE, { id }),
        data
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function deleteUser() {
    try {
      const response = await _axios.delete(FORM_ENDPOINTS.DELETE);
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getFormAnalyticsById(slug: string) {
    try {
      const response = await _axios.get(
        build_path(FORM_ENDPOINTS.GET_ANALYTICS, { slug })
      );
      return response.data as FormDetails;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
