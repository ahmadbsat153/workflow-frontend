export interface DashboardResponse {
  data: {
    userSubmissions: {
      totalSubmissions: number;
      recentSubmissions: {
        count: number;
        period: string;
      };
      byWorkflowStatus: Array<{
        status: string;
        count: number;
      }>;
      byApprovalStatus: Array<{
        status: string;
        count: number;
      }>;
      topForms: Array<{
        formId: string;
        formName: string;
        formSlug: string;
        count: number;
      }>;
      timeline: Array<{
        date: string; // YYYY-MM-DD
        count: number;
      }>;
    };
    formCreator: {
      forms: {
        total: number;
        active: number;
        inactive: number;
      };
      submissions: {
        total: number;
        recent: {
          count: number;
          period: string;
        };
      };
      submissionsByForm: Array<{
        formId: string;
        formName: string;
        formSlug: string;
        isActive: boolean;
        totalSubmissions: number;
        pending: number;
        processing: number;
        completed: number;
        failed: number;
        waitingApproval: number;
      }>;
      timeline: Array<{
        date: string; // YYYY-MM-DD
        count: number;
      }>;
      mostActiveForms: Array<{
        formId: string;
        formName: string;
        formSlug: string;
        recentSubmissions: number;
      }>;
      approvalStatistics: Array<{
        status: string;
        count: number;
      }>;
    } | null;
  };
}

export const chartColors = {
  workflow: {
    pending: "hsl(38, 92%, 50%)", // Amber
    processing: "hsl(217, 91%, 60%)", // Blue
    completed: "hsl(142, 71%, 45%)", // Green
    failed: "hsl(0, 84%, 60%)", // Red
    waiting_approval: "hsl(262, 83%, 58%)", // Purple
  },
  approval: {
    approved: "hsl(142, 76%, 36%)", // Dark Green
    pending: "hsl(38, 92%, 50%)", // Amber
    rejected: "hsl(0, 72%, 51%)", // Dark Red
    notApplicable: "hsl(215, 20%, 65%)", // Gray
  },
};
