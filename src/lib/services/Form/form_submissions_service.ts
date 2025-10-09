import { build_path } from "@/utils/common";
import { _axios, handleErrors } from "@/lib/api/_axios";
import { FORM_SUBMISSION_ENDPOINTS } from "@/lib/constants/endpoints";
import {
  FormSubmission,
  FormSubmissionList,
} from "@/lib/types/form/form_submission";

export namespace API_FORM_SUBMISSION {
  export async function getAllSubmissionsByForm(query: string, slug: string) {
    try {
      let request = `${FORM_SUBMISSION_ENDPOINTS.GET_ALL_BY_FORM}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(
        build_path(FORM_SUBMISSION_ENDPOINTS.GET_ALL_BY_FORM, { slug, query })
      );

      return response.data as FormSubmissionList;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getSubmissionById(id: string) {
    try {
      const response = await _axios.get(
        build_path(FORM_SUBMISSION_ENDPOINTS.GET_ID, { id })
      );
      return response.data.data as FormSubmission;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
