"use client";

import FormBuilder from "./CreateForm/FormBuilder";
import { TextCursorInput, Workflow } from "lucide-react";
import WorkflowBuilder from "../workflow/WorkflowBuilder";
import { useLayoutState } from "../../Common/ConditionalSelector";
import { LayoutOption, LayoutSelector } from "../../Common/LayoutSelector";

type LayoutType = "forms" | "workflow";

const layoutOptions: LayoutOption<any>[] = [
  { value: "forms", label: "Form Edit", icon: TextCursorInput },
  { value: "workflow", label: "Workflow Edit", icon: Workflow },
];

const FormEditContent = () => {
  const [currentLayout, setCurrentLayout] = useLayoutState<LayoutType>("forms");

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col px-2">
      <div className="flex justify-center">
        <LayoutSelector
          options={layoutOptions}
          defaultValue="forms"
          onLayoutChange={setCurrentLayout}
          displayMode="tabs"
        />
      </div>

      <div className="flex-1 h-full">
        {currentLayout === "forms" ? <FormBuilder /> : <WorkflowBuilder />}
      </div>
    </div>
  );
};

export default FormEditContent;
