"use client";

import * as Icons from "lucide-react";
import { Badge } from "@/lib/ui/badge";
import React from "react";
import { LucideIcon } from "lucide-react";
import { Handle, Position, NodeProps } from "reactflow";
import { WorkflowNodeData } from "@/lib/types/workflow/workflow";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Icons.Zap;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
  return Icon || Icons.Zap;
};

const getCategoryColor = (category?: string) => {
  const colors: Record<
    string,
    {
      bg: string;
      border: string;
      text: string;
      iconBg: string;
      dot: string;
    }
  > = {
    notification: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      dot: "bg-blue-500",
    },
    data: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-700",
      iconBg: "bg-green-100",
      dot: "bg-green-500",
    },
    approval: {
      bg: "bg-purple-50",
      border: "border-purple-400",
      text: "text-purple-700",
      iconBg: "bg-purple-100",
      dot: "bg-purple-500",
    },
    integration: {
      bg: "bg-orange-50",
      border: "border-orange-400",
      text: "text-orange-700",
      iconBg: "bg-orange-100",
      dot: "bg-orange-500",
    },
    logic: {
      bg: "bg-pink-50",
      border: "border-pink-400",
      text: "text-pink-700",
      iconBg: "bg-pink-100",
      dot: "bg-pink-500",
    },
  };
  return colors[category || "data"];
};
export const ActionNode = ({ data, selected }: NodeProps<WorkflowNodeData>) => {
  const IconComponent = getIconComponent(data.action?.icon);
  const colors = getCategoryColor(data.action?.category);

  const isConfigured = data.actionId && Object.keys(data.config).length > 0;

  return (
    <div className="relative">
      {/* Show toolbar on hover */}
      {/* //TODO: Re-enable toolbar when node actions are implemented */}
      {/* {isHovered && (
        <NodeToolbar
          onConfigure={() => {
            // Selection is handled by React Flow automatically when clicking the node
            console.log("Configure node:", id);
          }}
          onDuplicate={() => {
            // Emit custom event for duplication
            window.dispatchEvent(
              new CustomEvent("duplicateNode", { detail: { nodeId: id } })
            );
          }}
          onDelete={() => {
            // Emit custom event for deletion
            window.dispatchEvent(
              new CustomEvent("deleteNode", { detail: { nodeId: id } })
            );
          }}
        />
      )} */}

      <div
        className={`px-4 py-3 shadow-lg rounded-xl ${colors.bg} border-2 ${
          selected
            ? colors.border + " ring-2 ring-offset-2 ring-primary/20"
            : "border-gray-300"
        } min-w-[220px] max-w-[280px] transition-all hover:shadow-xl group`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400 border-2 border-white"
        />

        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`p-2 rounded-lg ${colors.iconBg} border ${colors.border} flex-shrink-0`}
            >
              <IconComponent className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">
                {data.action?.displayName || "Action"}
              </div>
              {data.action?.category && (
                <Badge
                  variant="outline"
                  className={`text-xs mt-1 ${colors.text} border-current`}
                >
                  {data.action.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0 ml-2">
            {isConfigured ? (
              <div className="relative group/status">
                <div
                  className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`}
                />
                <div className="absolute right-0 top-6 w-32 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none z-10">
                  ✓ Configured
                </div>
              </div>
            ) : (
              <div className="relative group/status">
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.AlertCircle className="w-4 h-4 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent className="flex items-center gap-2">
                    <Icons.AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-secondary text-lg">
                      Not configured
                    </span>
                  </TooltipContent>
                </Tooltip>

                {/* <div className="absolute right-0 top-6 w-32 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none z-10">
                  Not configured
                </div> */}
              </div>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400 border-2 border-white"
        />
      </div>
    </div>
  );
};
