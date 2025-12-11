/* eslint-disable @typescript-eslint/no-explicit-any */
import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "../../api/_axios";
import { WORKFLOW_ENDPOINTS } from "../../constants/endpoints";
import { SuccessResponse } from "../../types/common";
import {
  SaveWorkflowRequest,
  WorkflowResponse,
  WorkflowTable,
} from "../../types/workflow/workflow";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_WORKFLOW {
  /**
   * Save a new workflow
   */
  export async function saveWorkflow(
    form_id: string,
    data: SaveWorkflowRequest
  ) {
    try {
      const response = await _axios.post(
        build_path(WORKFLOW_ENDPOINTS.CREATE, { formId: form_id }),
        data
      );
      return response.data as WorkflowResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Update an existing workflow
   */
  export async function updateWorkflow(
    workflowId: string,
    data: Partial<SaveWorkflowRequest>
  ) {
    try {
      const response = await _axios.put(
        build_path(WORKFLOW_ENDPOINTS.UPDATE, { id: workflowId }),
        data
      );
      return response.data as WorkflowResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get a workflow by ID
   */
  export async function getWorkflow(workflowId: string) {
    try {
      const response = await _axios.get(
        build_path(WORKFLOW_ENDPOINTS.GET_ID, { id: workflowId })
      );
      return response.data as WorkflowResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get all workflows (with optional query params)
   */
  export async function getAllWorkflows(query?: string) {
    try {
      let request = `${WORKFLOW_ENDPOINTS.GET_ALL}`;

      if (query) {
        request = request + `${query}`;
      }

      const response = await _axios.get(request);
      return response.data as WorkflowTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get workflows by form ID
   */
  export async function getWorkflowsByForm(formId: string) {
    try {
      const response = await _axios.get(
        build_path(WORKFLOW_ENDPOINTS.GET_BY_FORM, { formId })
      );
      return response.data as WorkflowResponse[];
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Delete a workflow
   */
  export async function deleteWorkflow(workflowId: string) {
    try {
      const response = await _axios.delete(
        build_path(WORKFLOW_ENDPOINTS.DELETE, { id: workflowId })
      );
      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get workflow analytics (if needed in the future)
   */
  export async function getWorkflowAnalytics(workflowId: string) {
    try {
      const response = await _axios.get(
        build_path(WORKFLOW_ENDPOINTS.GET_ANALYTICS, { id: workflowId })
      );
      return response.data as any; // Define proper type when needed
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get workflow analytics (if needed in the future)
   */
  export async function getWorkflowByForm(formId: string) {
    try {
      const response = await _axios.get(
        build_path(WORKFLOW_ENDPOINTS.GET_BY_FORM, { formId })
      );
      return response.data.data as WorkflowResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
