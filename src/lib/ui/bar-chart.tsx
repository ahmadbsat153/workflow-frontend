"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import { ChartColumnStackedIcon } from "lucide-react";
import { BarChartDataPoint } from "../components/Pages/Users/UserAnalytics";

export function ChartBarMultiple({
  title,
  subtitle,
  data,
  chartConfig,
  footer,
}: {
  title?: string;
  subtitle?: string;
  data: BarChartDataPoint[];
  chartConfig?: ChartConfig;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full lg:w-[40vw] h-full">
      {data?.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig || {}}>
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                {Object.values(chartConfig || {}).map((item, index) => (
                  <Bar
                    key={index}
                    dataKey={
                      typeof item.label === "string"
                        ? item.label.toLowerCase()
                        : ""
                    }
                    fill={item.color}
                    radius={4}
                  />
                ))}
                <Bar dataKey="workflows" fill="#8ec5ff" radius={4} />
                <Bar dataKey="forms" fill="#2b7fff" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {footer}
          </CardFooter>
        </Card>
      ) : (
        <div className="h-full text-lg sm:text-sm border rounded-md text-center flex flex-col items-center justify-center text-primary gap-2">
          <ChartColumnStackedIcon size={40} />
          <div>No Data Available</div>
        </div>
      )}
    </div>
  );
}
