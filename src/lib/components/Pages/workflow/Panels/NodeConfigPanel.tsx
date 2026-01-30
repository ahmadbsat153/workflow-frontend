"use client";

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

import * as Icons from "lucide-react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Separator } from "@/lib/ui/separator";
import { ScrollArea } from "@/lib/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FieldTemplate } from "@/lib/types/form/form";
import { API_FORM } from "@/lib/services/Form/form_service";
import { BranchConfigForm } from "../Forms/BranchConfigForm";
import { WorkflowNode, BranchData } from "@/lib/types/workflow/workflow";
import {
  DynamicConfigForm,
  ConfigRecord,
  DynamicConfigFormHandle,
} from "../Forms/DynamicConfigForm";
import { NotificationReceiversInput } from "../Forms/NotificationReceiversInput";
import { NotificationReceivers } from "@/lib/types/actions/action";
import { SelectOption, SelectOptionGroup } from "@/lib/components/Common/SearchableSelect";

type NodeConfigPanelProps = {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdateConfig: (nodeId: string, config: ConfigRecord) => void;
  onChangeAction: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateBranches?: (nodeId: string, branches: BranchData[]) => void;
  formId?: string;
};

export const NodeConfigPanel = ({
  node,
  onClose,
  onUpdateConfig,
  onChangeAction,
  onDeleteNode,
  onUpdateBranches,
  formId,
}: NodeConfigPanelProps) => {
  const [availableTemplates, setAvailableTemplates] = useState<FieldTemplate[]>(
    []
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [notificationReceivers, setNotificationReceivers] = useState<
    NotificationReceivers | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState("configuration");
  const [hasConfigError, setHasConfigError] = useState(false);
  const formRef = useRef<DynamicConfigFormHandle>(null);

  // Initialize notification receivers from node config and reset tab state
  useEffect(() => {
    if (node?.data?.config) {
      setNotificationReceivers(
        (node.data.config as ConfigRecord)
          ?.notificationReceivers as NotificationReceivers
      );
    }
    // Reset tab state when node changes
    setActiveTab("configuration");
    setHasConfigError(false);
  }, [node?.id, node?.data?.config]);

  // Fetch field templates when panel opens and formId is available
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!formId) return;

      setLoadingTemplates(true);
      try {
        const response = await API_FORM.getFieldsTemplate(formId);
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

  const isApprovalAction =
    node?.type === "action" && node?.data.action?.category === "approval";

  // Compute available fields for branch conditions from templates + user org fields
  const branchAvailableFields = useMemo((): SelectOptionGroup[] => {
    // Dynamic form fields from templates (with labels)
    const formFields: SelectOption[] = availableTemplates.map((template) => ({
      label: template.label,
      value: template.name,
      description: template.type,
    }));

    // Static user organizational fields grouped by category
    const submitterFields: SelectOption[] = [
      { label: "Email", value: "submittedBy.email" },
      { label: "Name", value: "submittedBy.name" },
    ];

    const departmentFields: SelectOption[] = [
      { label: "Department Name", value: "user.department.name" },
      { label: "Department Code", value: "user.department.code" },
    ];

    const positionFields: SelectOption[] = [
      { label: "Position Name", value: "user.position.name" },
      { label: "Position Code", value: "user.position.code" },
      { label: "Position Level", value: "user.position.level" },
    ];

    const branchFields: SelectOption[] = [
      { label: "Branch Name", value: "user.branch.name" },
      { label: "Branch Code", value: "user.branch.code" },
      { label: "Branch City", value: "user.branch.location.city" },
      { label: "Branch Country", value: "user.branch.location.country" },
    ];

    const groups: SelectOptionGroup[] = [];

    // Only add Form Fields group if there are form fields
    if (formFields.length > 0) {
      groups.push({ label: "Form Fields", options: formFields });
    }

    groups.push(
      { label: "Submitter Info", options: submitterFields },
      { label: "Department", options: departmentFields },
      { label: "Position", options: positionFields },
      { label: "Branch", options: branchFields }
    );

    return groups;
  }, [availableTemplates]);

  const handleConfigSubmit = useCallback((config: ConfigRecord) => {
    if (!node) return;
    setHasConfigError(false);
    // For approval actions, include notification receivers
    if (isApprovalAction) {
      onUpdateConfig(node.id, {
        ...config,
        notificationReceivers,
      });
    } else {
      onUpdateConfig(node.id, config);
    }
  }, [isApprovalAction, node, notificationReceivers, onUpdateConfig]);

  const handleSaveConfiguration = useCallback(() => {
    if (formRef.current) {
      // Get current form values to check if it will validate
      formRef.current.submit();

      // After a brief delay, check if there are validation errors
      // If the form didn't submit (has errors), switch to configuration tab
      setTimeout(() => {
        const formElement = document.querySelector('form');
        const hasErrors = formElement?.querySelector('[data-state="invalid"]') ||
                         formElement?.querySelector('.text-destructive');
        if (hasErrors) {
          setHasConfigError(true);
          setActiveTab("configuration");
        }
      }, 50);
    }
  }, []);

  const handleBranchesChange = useCallback((branches: BranchData[]) => {
    if (onUpdateBranches && node) {
      onUpdateBranches(node.id, branches);
    }
  }, [node, onUpdateBranches]);

  const handleDelete = useCallback(() => {
    if (!node) return;
    onDeleteNode(node.id);
    onClose();
  }, [node, onClose, onDeleteNode]);

  if (!node) return null;

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

          {/* Configuration Form - with tabs for approval actions */}
          {node.type === "action" && node.data.action && (
            <div>
              {loadingTemplates && (
                <div className="text-xs text-muted-foreground mb-2">
                  Loading field templates...
                </div>
              )}

              {isApprovalAction ? (
                // Tabbed interface for approval actions
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="configuration">
                      Configuration
                      {hasConfigError && (
                        <span className="ml-1 h-2 w-2 rounded-full bg-destructive" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="receivers">Receivers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="configuration" className="mt-4" forceMount hidden={activeTab !== "configuration"}>
                    <DynamicConfigForm
                      ref={formRef}
                      key={node.id}
                      nodeId={node.id}
                      fields={node.data.action.configSchema.fields}
                      initialConfig={node.data.config as ConfigRecord}
                      onSubmit={handleConfigSubmit}
                      availableTemplates={availableTemplates}
                      hideSubmitButton
                    />
                  </TabsContent>

                  <TabsContent value="receivers" className="mt-4" forceMount hidden={activeTab !== "receivers"}>
                    <NotificationReceiversInput
                      value={notificationReceivers}
                      onChange={setNotificationReceivers}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                // Regular form for non-approval actions
                <>
                  <h4 className="text-sm font-semibold mb-4">Configuration</h4>
                  <DynamicConfigForm
                    key={node.id}
                    nodeId={node.id}
                    fields={node.data.action.configSchema.fields}
                    initialConfig={node.data.config as ConfigRecord}
                    onSubmit={handleConfigSubmit}
                    availableTemplates={availableTemplates}
                  />
                </>
              )}
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
                availableFields={branchAvailableFields}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer with Save button for approval actions */}
      {isApprovalAction && (
        <div className="p-4 border-t">
          <Button onClick={handleSaveConfiguration} className="w-full">
            Save Configuration
          </Button>
        </div>
      )}
    </div>
  );
};
