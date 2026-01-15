"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { ChartPieIcon } from "lucide-react";
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
import { DataKey } from "recharts/types/util/types";
import { PieData } from "../components/Pages/Users/UserAnalytics";

interface BaseChartData {
  [key: string]: string | number | boolean | undefined;
}

export function ChartPieDonutText({
  title,
  subtitle,
  footer,
  content,
  data,
  chartConfig,
  nameKey,
  dataKey,
}: {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  content?: { label: string; value: string };
  data?: PieData[];
  chartConfig?: ChartConfig;
  nameKey: DataKey<string>;
  dataKey: DataKey<string>;
}) {
  //Map over the count of each category and see if all are 0 then return null
  const isDataEmpty = data
    ? data.every((item: PieData) => item.count === 0)
    : true;

  return (
    <div className="w-full lg:w-[40vw] h-full">
      {!isDataEmpty ? (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig || {}}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data as unknown as BaseChartData[]}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {content?.value}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              {content?.label}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
        </Card>
      ) : (
        <div className="h-full text-lg sm:text-sm border rounded-md text-center flex flex-col items-center justify-center text-primary gap-2">
          <ChartPieIcon size={40} />
          <div>No Data Available</div>
        </div>
      )}
    </div>
  );
}

export default ChartPieDonutText;
