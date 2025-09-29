// lib/components/Pages/Forms/FormsPageContent.tsx
"use client";

import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import FormsTable from "@/lib/components/Pages/Forms/FormsTable";
import { TableIcon, GridIcon } from "lucide-react";
import {
  LayoutOption,
  LayoutSelector,
} from "@/lib/components/Common/LayoutSelector";
import { useLayoutState } from "@/lib/components/Common/ConditionalSelector";
import FormCardList from "./FormCardList";

type LayoutType = "table" | "grid";

const layoutOptions: LayoutOption<LayoutType>[] = [
  { value: "table", label: "Table View", icon: TableIcon },
  { value: "grid", label: "Grid View", icon: GridIcon },
];

export default function FormsPageContent() {
  const [currentLayout, setCurrentLayout] = useLayoutState<LayoutType>("grid");

  return (
    <>
      <HeaderContainer
        title="Forms"
        description="Manage all platform forms from here"
      >
        <LayoutSelector
          options={layoutOptions}
          defaultValue="grid"
          onLayoutChange={setCurrentLayout}
        />
      </HeaderContainer>

      {currentLayout === "table" ? <FormsTable /> : <FormCardList />}
    </>
  );
}
