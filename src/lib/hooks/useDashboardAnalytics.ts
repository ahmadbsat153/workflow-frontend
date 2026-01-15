import { useState, useEffect } from "react";
import { DashboardResponse } from "@/lib/types/dashboard";
import { _axios, handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "../types/common";
import { toast } from "sonner";

export function useDashboardAnalytics() {
  const [data, setData] = useState<DashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await _axios.get<DashboardResponse>(
        "/api/v1/dashboard/analytics"
      );

      setData(response.data.data);
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        setError((err_msg as string) || "Failed to fetch analytics");
        toast.error(err_msg || "Failed to fetch analytics");
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
