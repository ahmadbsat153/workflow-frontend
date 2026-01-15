 
import { build_path } from "@/utils/common";
import { handleErrors, _axios } from "../api/_axios";
import { APPROVAL_ENDPOINTS } from "../constants/endpoints";
import type {
  ApprovalVerificationResponse,
  ApprovalDecisionRequest,
  ApprovalDecisionResponse,
  DecideRequest,
  MyApprovalTable,
} from "../types/approval";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_APPROVAL {
  export async function verifyToken(token: string) {
    try {
      const response = await _axios.get(
        build_path(APPROVAL_ENDPOINTS.VERIFY, { token })
      );
      return response.data as ApprovalVerificationResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function approve(token: string, data?: ApprovalDecisionRequest) {
    try {
      const response = await _axios.post(
        build_path(APPROVAL_ENDPOINTS.APPROVE, { token }),
        data || {}
      );
      return response.data as ApprovalDecisionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function reject(token: string, data?: ApprovalDecisionRequest) {
    try {
      const response = await _axios.post(
        build_path(APPROVAL_ENDPOINTS.REJECT, { token }),
        data || {}
      );
      return response.data as ApprovalDecisionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function decide(token: string, data: DecideRequest) {
    try {
      const response = await _axios.post(
        build_path(APPROVAL_ENDPOINTS.DECIDE, { token }),
        data
      );
      return response.data as ApprovalDecisionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function getMyApprovals(queryString: string = "") {
    try {
      const url = `${APPROVAL_ENDPOINTS.GET_MY_APPROVALS}${
        queryString ? `?${queryString}` : ""
      }`;
      const response = await _axios.get(url);

      return response.data as MyApprovalTable;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function approveSubmission(
    submissionId: string,
    stageOrder: string,
    comments?: string
  ) {
    try {
      const response = await _axios.post(
        `/api/v1/approvals/submissions/${submissionId}/approve`,
        {
          stageOrder,
          comments: comments || undefined,
        }
      );
      return response.data as ApprovalDecisionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function rejectSubmission(
    submissionId: string,
    stageOrder: string,
    comments: string
  ) {
    try {
      const response = await _axios.post(
        `/api/v1/approvals/submissions/${submissionId}/reject`,
        {
          stageOrder,
          comments,
        }
      );
      return response.data as ApprovalDecisionResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
