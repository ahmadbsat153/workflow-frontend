import { _axios, handleErrors } from "@/lib/api/_axios";
import { WorkflowHistoryList } from "@/lib/types/workflow/workflow";
import { WORKFLOW_HISTORY_ENDPOINTS } from "@/lib/constants/endpoints";

export namespace API_WORKFLOW_HISTORY {
  export async function getHistory(query?: string) {
    try {
      let request = `${WORKFLOW_HISTORY_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as WorkflowHistoryList;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
