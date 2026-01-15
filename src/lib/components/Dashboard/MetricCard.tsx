import { Card, CardContent, CardHeader } from "@/lib/ui/card";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: string;
  icon: LucideIcon;
  trendDirection?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  trendDirection = "neutral",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            {trendDirection === "up" && (
              <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
            )}
            {trendDirection === "down" && (
              <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
