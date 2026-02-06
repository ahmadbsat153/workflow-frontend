"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopFormsChartProps {
  data: Array<{
    formId: string;
    formName: string;
    formSlug: string;
    count: number;
  }>;
}


export function TopFormsChart({ data }: TopFormsChartProps) {
  const isMobile = useIsMobile();

  const chartData = data.slice(0, 5).map((item) => ({
    name: item.formName,
    fullName: item.formName,
    submissions: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Forms</CardTitle>
          <CardDescription>Your most used forms</CardDescription>
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
        <CardTitle>Top 5 Forms</CardTitle>
        <CardDescription>Your most used forms</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8F7F2",
                border: "1px solid darkgray",
                borderRadius: "6px",
              }}
              formatter={(value) => [value, "Submissions"]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string } | undefined;
                return item?.fullName || label;
              }}
            />
            <Bar dataKey="submissions" fill="#3B82F6" radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey="name"
                content={({ y, height, value }) => {
                  const yPos = typeof y === "number" ? y : 0;
                  const h = typeof height === "number" ? height : 0;
                  return (
                    <text
                      x={20}
                      y={yPos + h / 2}
                      fill="#000"
                      fontSize={isMobile ? 11 : 12}
                      dominantBaseline="middle"
                      textAnchor="start"
                    >
                      {value}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
