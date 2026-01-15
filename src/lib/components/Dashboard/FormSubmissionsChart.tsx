"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartColors } from "@/lib/types/dashboard";

export type FormSubmissionsChartProps = {
  data: Array<{
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
}

export function FormSubmissionsChart({ data }: FormSubmissionsChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    name:
      item.formName.length > 15
        ? item.formName.substring(0, 15) + "..."
        : item.formName,
    Pending: item.pending,
    Processing: item.processing,
    Completed: item.completed,
    Failed: item.failed,
    "Waiting Approval": item.waitingApproval,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions by Form</CardTitle>
          <CardDescription>Status distribution for each form</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No submissions received yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions by Form</CardTitle>
        <CardDescription>Status distribution for each form</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Bar
              dataKey="Pending"
              stackId="a"
              fill={chartColors.workflow.pending}
            />
            <Bar
              dataKey="Processing"
              stackId="a"
              fill={chartColors.workflow.processing}
            />
            <Bar
              dataKey="Completed"
              stackId="a"
              fill={chartColors.workflow.completed}
            />
            <Bar dataKey="Failed" stackId="a" fill={chartColors.workflow.failed} />
            <Bar
              dataKey="Waiting Approval"
              stackId="a"
              fill={chartColors.workflow.waiting_approval}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
