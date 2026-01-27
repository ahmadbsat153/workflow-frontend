"use client";

import { useState, useCallback } from "react";
import FormDetailsTab from "./FormDetailsTab";
import FormBuilder from "./CreateForm/FormBuilder";
import WorkflowBuilder from "../workflow/WorkflowBuilder";
import FormSettingsTab from "./FormSettingsTab";
import { useLayoutState } from "../../Common/ConditionalSelector";
import { FileText, TextCursorInput, Workflow, Settings } from "lucide-react";
import { LayoutOption, LayoutSelector } from "../../Common/LayoutSelector";
import {
  FormEditProvider,
  useFormEditContext,
} from "@/lib/context/FormEditContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/ui/alert-dialog";
import { Button } from "@/lib/ui/button";

type LayoutType = "details" | "forms" | "workflow" | "settings";

const layoutOptions: LayoutOption<LayoutType>[] = [
  { value: "details", label: "Form Details", icon: FileText },
  { value: "forms", label: "Form Edit", icon: TextCursorInput },
  { value: "workflow", label: "Workflow Edit", icon: Workflow },
  { value: "settings", label: "Settings", icon: Settings },
];

const FormEditContentInner = () => {
  const [currentLayout, setCurrentLayout] =
    useLayoutState<LayoutType>("details");
  const { isFormDirty, isWorkflowDirty, setFormDirty, setWorkflowDirty } =
    useFormEditContext();
  const [pendingLayout, setPendingLayout] = useState<LayoutType | null>(null);
  const [showDirtyAlert, setShowDirtyAlert] = useState(false);

  const handleLayoutChange = useCallback(
    (newLayout: LayoutType) => {
      // Check if leaving a dirty tab
      const isLeavingDirtyForm = currentLayout === "forms" && isFormDirty;
      const isLeavingDirtyWorkflow =
        currentLayout === "workflow" && isWorkflowDirty;

      if (isLeavingDirtyForm || isLeavingDirtyWorkflow) {
        setPendingLayout(newLayout);
        setShowDirtyAlert(true);
        return;
      }

      setCurrentLayout(newLayout);
    },
    [currentLayout, isFormDirty, isWorkflowDirty, setCurrentLayout]
  );

  const handleConfirmNavigation = useCallback(() => {
    if (pendingLayout) {
      // Reset dirty state for the tab we're leaving
      if (currentLayout === "forms") {
        setFormDirty(false);
      } else if (currentLayout === "workflow") {
        setWorkflowDirty(false);
      }
      setCurrentLayout(pendingLayout);
      setPendingLayout(null);
    }
    setShowDirtyAlert(false);
  }, [pendingLayout, currentLayout, setFormDirty, setWorkflowDirty, setCurrentLayout]);

  const handleCancelNavigation = useCallback(() => {
    setPendingLayout(null);
    setShowDirtyAlert(false);
  }, []);

  const renderContent = () => {
    switch (currentLayout) {
      case "details":
        return <FormDetailsTab />;
      case "forms":
        return <FormBuilder />;
      case "workflow":
        return <WorkflowBuilder />;
      case "settings":
        return <FormSettingsTab />;
      default:
        return <FormDetailsTab />;
    }
  };

  return (
    <>
      <div className="bg-gray-50 w-full h-full flex flex-col">
        <div className="flex justify-start pl-2">
          <LayoutSelector
            options={layoutOptions}
            defaultValue="details"
            onLayoutChange={handleLayoutChange}
            displayMode="tabs"
          />
        </div>

        <div className="flex-1 h-full">{renderContent()}</div>
      </div>

      <AlertDialog open={showDirtyAlert} onOpenChange={setShowDirtyAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the{" "}
              {currentLayout === "forms" ? "Form Editor" : "Workflow Editor"}.
              If you leave now, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation}>
              Stay
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNavigation}
            >
              <Button variant="destructive">Discard changes</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const FormEditContent = () => {
  return (
    <FormEditProvider>
      <FormEditContentInner />
    </FormEditProvider>
  );
};

export default FormEditContent;
