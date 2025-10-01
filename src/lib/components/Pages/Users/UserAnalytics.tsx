import { useMemo, useState } from "react";
import { CellRenderer, DataTable } from "../../Table/DataTable";
import {
  USER_ACTIVITY_COLUMNS,
  USER_ACTIVITY_VISIBLE_COL,
} from "@/lib/constants/tables";
import { formatDatesWithYear } from "@/utils/common";
import { Badge } from "@/lib/ui/badge";
import ChartPieDonutText from "@/lib/ui/pie-chart";
import { ChartBarMultiple } from "@/lib/ui/bar-chart";

const UserAnalytics = ({ data }: { data: any }) => {
  const [visibleColumns] = useState<Set<string>>(
    new Set(USER_ACTIVITY_VISIBLE_COL)
  );
  const [loading, setLoading] = useState(false);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return USER_ACTIVITY_COLUMNS;

    return USER_ACTIVITY_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const cellRenderers: Partial<Record<string, CellRenderer<any>>> = {
    type: (value, row) => <span className="font-medium">{row.type}</span>,

    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
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

  const footer = () => {
    return (
      <div className="text-muted-foreground leading-none">
        Showing total forms and workflows created and submitted
      </div>
    );
  };

  const pieData = [
    { category: "forms", count: data.forms, fill: "#7c86ff" },
    { category: "submissions", count: data.submissions, fill: "#ff637e" },
  ];
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
  const barChartData = [
  { month: "January", workflows: 186, forms: 80 },
  { month: "February", workflows: 305, forms: 200 },
  { month: "March", workflows: 237, forms: 120 },
  { month: "April", workflows: 73, forms: 190 },
  { month: "May", workflows: 209, forms: 130 },
  { month: "June", workflows: 214, forms: 140 },
]

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
  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {/* CHARTS */}
      <div className="flex flex-col lg:flex-row gap-2">
        <ChartBarMultiple 
            data={barChartData}
            chartConfig={barChartConfig}
        />
        <ChartPieDonutText
            chartConfig={pieChartConfig}
            content={{ label: "Total", value: data.total }}
            data={pieData}
            footer={footer()}
        />

      </div>
      
      {/* RECENT ACTIVITY TABLE  */}
      <DataTable
        data={data.recentActivities}
        columns={headerColumns}
        cellRenderers={cellRenderers}
        loading={loading}
      />
    </div>
  );
};

export default UserAnalytics;
