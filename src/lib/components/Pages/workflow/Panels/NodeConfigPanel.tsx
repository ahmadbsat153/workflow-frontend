"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { ScrollArea } from "@/lib/ui/scroll-area";
import { Separator } from "@/lib/ui/separator";
import { DynamicConfigForm } from "../Forms/DynamicConfigForm";
import { BranchConfigForm } from "../Forms/BranchConfigForm";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/ui/alert-dialog";
import { WorkflowNode } from "@/lib/types/workflow/workflow";
import { FieldTemplate } from "@/lib/types/form/form";
import { API_FORM } from "@/lib/services/Form/form_service";

interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
  onChangeAction: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateBranches?: (nodeId: string, branches: any[]) => void;
  formId?: string;
}

export const NodeConfigPanel = ({
  node,
  onClose,
  onUpdateConfig,
  onChangeAction,
  onDeleteNode,
  onUpdateBranches,
  formId,
}: NodeConfigPanelProps) => {
  const [availableTemplates, setAvailableTemplates] = useState<FieldTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Fetch field templates when panel opens and formId is available
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!formId) return;

      setLoadingTemplates(true);
      try {
        const response = await API_FORM.getFieldsTemplate(formId);
        console.log("Fetched field templates:", response);
        const allTemplates = [...response.fields, ...response.metadata];
        setAvailableTemplates(allTemplates);
      } catch (error) {
        console.error("Failed to fetch field templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [formId]);

  if (!node) return null;

  const handleConfigSubmit = (config: Record<string, any>) => {
    onUpdateConfig(node.id, config);
  };

  const handleBranchesChange = (branches: any[]) => {
    if (onUpdateBranches) {
      onUpdateBranches(node.id, branches);
    }
  };

  const handleDelete = () => {
    onDeleteNode(node.id);
    onClose();
  };

  return (
    <div className="w-96 max-h-[85vh] border-l bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Configure Node</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 h-[50vh]">
        <div className="p-4 space-y-6">
          {/* Node Info */}
          <div className="space-y-4">
            <div>
              {node.type === "action" && node.data.action ? (
                <div className="">
                  <div className="flex-1">
                    <div className="font-medium flex justify-between">
                      {node.data.action.displayName}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onChangeAction(node.id)}
                          className="flex-1"
                        >
                          <Icons.ArrowLeftRightIcon />
                        </Button>
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline_destructive"
                                size="icon"
                                className={
                                  node.type === "action" && node.data.action
                                    ? ""
                                    : "flex-1"
                                }
                              >
                                <Trash2 className="text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Node?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this node and all
                                  its connections. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {node.data.action.actionDescription}
                    </div>
                  </div>
                </div>
              ) : node.type === "branch" ? (
                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <div className="p-2 rounded bg-orange-100">
                    <Icons.GitBranch className="h-5 w-5 text-orange-700" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Branch Decision</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Conditional routing
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No action selected
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Configuration Form */}
          {node.type === "action" && node.data.action && (
            <div>
              <h4 className="text-sm font-semibold mb-4">Configuration</h4>
              {loadingTemplates && (
                <div className="text-xs text-muted-foreground mb-2">
                  Loading field templates...
                </div>
              )}
              <DynamicConfigForm
                key={node.id}
                nodeId={node.id}
                fields={node.data.action.configSchema.fields}
                initialConfig={node.data.config}
                onSubmit={handleConfigSubmit}
                availableTemplates={availableTemplates}
              />
            </div>
          )}

          {/* Branch Configuration */}
          {node.type === "branch" && (
            <div>
              <h4 className="text-sm font-semibold mb-4">
                Branch Configuration
              </h4>
              <BranchConfigForm
                branches={node.data.branches || []}
                onChange={handleBranchesChange}
                availableFields={[
                  // Form fields
                  "department",
                  "leaveType",
                  "status",

                  // Submitter fields
                  "submittedBy.email",
                  "submittedBy.name",

                  // User organizational fields
                  "user.department.name",
                  "user.department.code",
                  "user.position.name",
                  "user.position.code",
                  "user.position.level",
                  "user.branch.name",
                  "user.branch.code",
                  "user.branch.location.city",
                  "user.branch.location.country",
                ]}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
