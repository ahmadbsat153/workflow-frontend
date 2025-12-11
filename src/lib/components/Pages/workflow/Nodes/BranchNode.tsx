"use client";

import React from "react";
import { Badge } from "@/lib/ui/badge";
import { GitBranch, AlertCircle } from "lucide-react";
import { Handle, Position, NodeProps } from "reactflow";
import { WorkflowNodeData } from "@/lib/types/workflow/workflow";

export const BranchNode = ({ data, selected }: NodeProps<WorkflowNodeData>) => {
  const hasConditions = data.branches?.some(b => b.conditions && b.conditions.length > 0);
  
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-xl bg-orange-50 border-2 ${
        selected ? "border-orange-500 ring-2 ring-offset-2 ring-orange-200" : "border-gray-300"
      } min-w-[240px] max-w-[300px] transition-all hover:shadow-xl`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 border-2 border-white"
      />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-orange-100 border border-orange-400">
            <GitBranch className="h-5 w-5 text-orange-700" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Branch Decision</div>
            <Badge variant="outline" className="text-xs mt-1 text-orange-700 border-current">
              Conditional
            </Badge>
          </div>
        </div>
        
        {/* Status */}
        <div className="flex-shrink-0 ml-2">
          {hasConditions ? (
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
        </div>
      </div>
      
      {/* Step Name */}
      <div className="text-xs text-gray-600 mb-3 truncate font-medium">
        {data.stepName}
      </div>
      
      {/* Branch Paths */}
      {data.branches && data.branches.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-orange-200">
          {data.branches.map((branch, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-orange-900 font-medium truncate flex-1">
                {branch.name}
              </span>
              <Badge 
                variant="secondary" 
                className="text-xs ml-2"
              >
                {branch.conditions?.length || 0} rules
              </Badge>
            </div>
          ))}
        </div>
      )}
      
      {/* Branch Handles */}
      {data.branches?.map((branch, idx) => (
        <Handle
          key={idx}
          type="source"
          position={Position.Bottom}
          id={`branch-${idx}`}
          style={{ 
            left: `${((idx + 1) * 100) / (data.branches!.length + 1)}%`,
          }}
          className="w-3 h-3 !bg-orange-500 border-2 border-white"
        />
      ))}
    </div>
  );
};