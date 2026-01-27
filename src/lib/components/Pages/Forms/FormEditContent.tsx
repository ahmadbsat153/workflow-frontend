"use client";

import FormDetailsTab from "./FormDetailsTab";
import FormBuilder from "./CreateForm/FormBuilder";
import WorkflowBuilder from "../workflow/WorkflowBuilder";
import FormSettingsTab from "./FormSettingsTab";
import { useLayoutState } from "../../Common/ConditionalSelector";
import { FileText, TextCursorInput, Workflow, Settings } from "lucide-react";
import { LayoutOption, LayoutSelector } from "../../Common/LayoutSelector";

type LayoutType = "details" | "forms" | "workflow" | "settings";

const layoutOptions: LayoutOption<LayoutType>[] = [
  { value: "details", label: "Form Details", icon: FileText },
  { value: "forms", label: "Form Edit", icon: TextCursorInput },
  { value: "workflow", label: "Workflow Edit", icon: Workflow },
  { value: "settings", label: "Settings", icon: Settings },
];

const FormEditContent = () => {
  const [currentLayout, setCurrentLayout] =
    useLayoutState<LayoutType>("details");

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
    <div className="bg-gray-50 w-full h-full flex flex-col">
      <div className="flex justify-start pl-2">
        <LayoutSelector
          options={layoutOptions}
          defaultValue="details"
          onLayoutChange={setCurrentLayout}
          displayMode="tabs"
        />
      </div>

      <div className="flex-1 h-full">{renderContent()}</div>
    </div>
  );
};

export default FormEditContent;
