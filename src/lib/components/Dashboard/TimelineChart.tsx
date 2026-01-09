"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface TimelineChartProps {
  data: Array<{ date: string; count: number }>;
  title?: string;
  description?: string;
}

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "MMM d");
  } catch {
    return dateString;
  }
};

export function TimelineChart({
  data,
  title = "Submission Timeline",
  description = "Last 30 days",
}: TimelineChartProps) {
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    submissions: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
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
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorSubmissions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
