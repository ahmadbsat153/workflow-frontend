import {
  USER_ACTIVITY_COLUMNS,
  USER_ACTIVITY_VISIBLE_COL,
} from "@/lib/constants/tables";

import { Badge } from "@/lib/ui/badge";
import { useMemo, useState } from "react";
import { DataTable } from "../../Table/DataTable";
import ChartPieDonutText from "@/lib/ui/pie-chart";
import { formatDatesWithYear } from "@/utils/common";
import { ChartBarMultiple } from "@/lib/ui/bar-chart";
import { CellRenderer } from "@/lib/types/table/table_data";

export interface BarChartDataPoint {
  month: string;
  forms: number;
  workflows: number;
}

interface RecentActivity {
  _id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
}

export interface PieData {
  category: string;
  count: number;
  fill: string;
}

interface UserAnalyticsData {
  forms?: number;
  submissions?: number;
  total?: number;
  barChartAnalytics?: BarChartDataPoint[];
  recentActivities?: RecentActivity[];
}

const UserAnalytics = ({ data }: { data: UserAnalyticsData | null }) => {
  const [visibleColumns] = useState<Set<string>>(
    new Set(USER_ACTIVITY_VISIBLE_COL),
  );
  const loading = false;

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return USER_ACTIVITY_COLUMNS;

    return USER_ACTIVITY_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid),
    );
  }, [visibleColumns]);

  const cellRenderers: Partial<Record<string, CellRenderer<RecentActivity>>> = {
    type: (value, row) => <span className="font-medium">{row.type}</span>,

    createdAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    is_active: (value) => (
      <div className="">
        {value ? (
          <Badge variant="active">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>
    ),
  };

  const footer = (description: string) => {
    return (
      <div className="text-muted-foreground leading-none">{description}</div>
    );
  };

  const pieChartConfig = {
    forms: {
      label: "Forms",
      color: "#7c86ff",
    },
    submissions: {
      label: "Submissions",
      color: "#ff637e",
    },
  };

  const barChartConfig = {
    workflows: {
      label: "Workflows",
      color: "#8ec5ff",
    },
    forms: {
      label: "Forms",
      color: "#2b7fff",
    },
  };

  // Handle empty array or null/undefined data - after all hooks
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  const pieData: PieData[] = [
    { category: "forms", count: data.forms || 0, fill: "#7c86ff" },
    { category: "submissions", count: data.submissions || 0, fill: "#ff637e" },
  ];

  console.log("User analytics data:", data);

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {/* CHARTS */}
      <div className="flex flex-col lg:flex-row gap-2 min-h-[30vh]">
        <ChartBarMultiple
          data={data.barChartAnalytics || []}
          chartConfig={barChartConfig}
          footer={footer(
            "Showing total forms and workflows created over last 6 months",
          )}
        />
        <ChartPieDonutText
          chartConfig={pieChartConfig}
          content={{ label: "Total", value: String(data.total || 0) }}
          data={pieData}
          nameKey="category"
          dataKey="count"
          footer={footer(
            "Showing forms created and submitted over last 6 months",
          )}
        />
      </div>

      {/* RECENT ACTIVITY TABLE  */}
      <DataTable
        data={data.recentActivities || []}
        columns={headerColumns}
        cellRenderers={cellRenderers}
        loading={loading}
      />
    </div>
  );
};

export default UserAnalytics;
