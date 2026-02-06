"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieLabelRenderProps,
} from "recharts";
import { chartColors } from "@/lib/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";

interface ApprovalStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

interface PieLabelProps {
  name: string;
  percent: number;
}

const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower === "approved") return chartColors.approval.approved;
  if (statusLower === "pending") return chartColors.approval.pending;
  if (statusLower === "rejected") return chartColors.approval.rejected;
  return chartColors.approval.notApplicable;
};

export function ApprovalStatusChart({ data }: ApprovalStatusChartProps) {
  const isMobile = useIsMobile();
  const chartData = data.map((item) => ({
    name: formatStatus(item.status),
    value: item.count,
    color: getStatusColor(item.status),
  }));

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  if (totalCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
          <CardDescription>Distribution of approval statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No approval data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Status</CardTitle>
        <CardDescription>Distribution of approval statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy={isMobile ? "40%" : "50%"}
              outerRadius={isMobile ? 60 : 80}
              label={
                isMobile
                  ? false
                  : (props: PieLabelRenderProps) => {
                      const { name, percent } = props;
                      const percentage =
                        typeof percent === "number"
                          ? `${(percent * 100).toFixed(0)}%`
                          : "";
                      return `${name}: ${percentage}`;
                    }
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8F7F2",
                border: "1px solid darkgray",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
