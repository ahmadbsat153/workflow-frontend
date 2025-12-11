"use client";

import React from "react";
import { Action } from "@/lib/types/actions/action";
import { Badge } from "@/lib/ui/badge";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  action: Action;
  onDragStart?: (action: Action) => void;
}

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Icons.Zap;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
  return Icon || Icons.Zap;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    notification: "bg-blue-100 text-blue-800 border-blue-200",
    data: "bg-green-100 text-green-800 border-green-200",
    approval: "bg-purple-100 text-purple-800 border-purple-200",
    integration: "bg-orange-100 text-orange-800 border-orange-200",
    logic: "bg-pink-100 text-pink-800 border-pink-200",
  };
  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const ActionCard = ({ action, onDragStart }: ActionCardProps) => {
  const IconComponent = getIconComponent(action.icon);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", action._id);
    e.dataTransfer.setData("actionData", JSON.stringify(action));

    if (onDragStart) {
      onDragStart(action);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 border rounded-lg cursor-move hover:shadow-md hover:border-primary/50 transition-all bg-background"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">
              {action.displayName}
            </h4>
          </div>
          <Badge
            className={`${getCategoryColor(action.category)} text-xs mb-2`}
          >
            {action.category}
          </Badge>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {action.actionDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
