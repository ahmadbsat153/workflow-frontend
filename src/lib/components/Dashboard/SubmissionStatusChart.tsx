"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { chartColors } from "@/lib/types/dashboard";

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
  const chartData = data.map((item) => ({
    name: formatStatus(item.status),
    value: item.count,
    color: chartColors.workflow[item.status as keyof typeof chartColors.workflow] || "#6b7280",
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
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
