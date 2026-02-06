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

interface SubmissionStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function SubmissionStatusChart({ data }: SubmissionStatusChartProps) {
  const isMobile = useIsMobile();
  const chartData = data.map((item) => ({
    name: formatStatus(item.status),
    value: item.count,
    color:
      chartColors.workflow[item.status as keyof typeof chartColors.workflow] ||
      "#6b7280",
  }));

  const totalSubmissions = data.reduce((sum, item) => sum + item.count, 0);

  if (totalSubmissions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions by Status</CardTitle>
          <CardDescription>Distribution of your submissions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No submissions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions by Status</CardTitle>
        <CardDescription>Distribution of your submissions</CardDescription>
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
