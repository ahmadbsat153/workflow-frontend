"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/lib/ui/accordion";
import { Input } from "@/lib/ui/input";
import React, { useState } from "react";
import { Button } from "@/lib/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ConditionBuilder } from "./ConditionBuilder";
import { BranchData } from "@/lib/types/workflow/workflow";

interface BranchConfigFormProps {
  branches: BranchData[];
  onChange: (branches: BranchData[]) => void;
  availableFields?: string[];
}

export const BranchConfigForm = ({
  branches,
  onChange,
  availableFields = [],
}: BranchConfigFormProps) => {
  const [expandedBranch, setExpandedBranch] = useState<string>("branch-0");

  const addBranch = () => {
    const newBranch: BranchData = {
      name: `Path ${branches.length + 1}`,
      conditions: [],
      conditionLogic: "AND",
      targetStepTempId: null,
    };
    onChange([...branches, newBranch]);
    setExpandedBranch(`branch-${branches.length}`);
  };

  const removeBranch = (index: number) => {
    if (branches.length <= 2) {
      alert("Branch must have at least 2 paths");
      return;
    }
    onChange(branches.filter((_, i) => i !== index));
  };

  const updateBranch = (index: number, updates: Partial<BranchData>) => {
    const updated = branches.map((branch, i) =>
      i === index ? { ...branch, ...updates } : branch
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Branch Paths</h4>
        <span className="text-xs text-muted-foreground">
          {branches.length} path{branches.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Accordion
        type="single"
        collapsible
        value={expandedBranch}
        onValueChange={setExpandedBranch}
      >
        {branches.map((branch, index) => (
          <AccordionItem key={index} value={`branch-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-medium">{branch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {branch.conditions?.length || 0} condition
                    {branch.conditions?.length !== 1 ? "s" : ""}
                  </span>
                  {branches.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBranch(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                {/* Branch Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Path Name</label>
                  <Input
                    placeholder="e.g., IT Department"
                    value={branch.name}
                    onChange={(e) =>
                      updateBranch(index, { name: e.target.value })
                    }
                  />
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Conditions</label>
                  <ConditionBuilder
                    conditions={branch.conditions || []}
                    onChange={(conditions) =>
                      updateBranch(index, { conditions })
                    }
                    conditionLogic={branch.conditionLogic}
                    onLogicChange={(logic) =>
                      updateBranch(index, { conditionLogic: logic })
                    }
                    availableFields={availableFields}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Branch Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addBranch}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Path
      </Button>
    </div>
  );
};