import { _axios, handleErrors } from "@/lib/api/_axios";
import { FORM_SUBMISSION_ENDPOINTS } from "@/lib/constants/endpoints";
import { FormSubmissionList } from "@/lib/types/form/form_submission";
import { build_path } from "@/utils/common";

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

      //   const response = await _axios.get(request);
      return response.data as FormSubmissionList;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
