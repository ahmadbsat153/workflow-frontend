import { _axios, handleErrors } from "@/lib/api/_axios";
import { WorkflowHistoryList } from "@/lib/types/workflow/workflow";
import { WORKFLOW_HISTORY_ENDPOINTS } from "@/lib/constants/endpoints";

export const API_WORKFLOW_HISTORY = {
  getHistory: async function (query?: string): Promise<WorkflowHistoryList> {
    try {
      let request = `${WORKFLOW_HISTORY_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  },
};
