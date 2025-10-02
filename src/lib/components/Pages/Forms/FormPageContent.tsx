// lib/components/Pages/Forms/FormsPageContent.tsx
"use client";

import {
  LayoutOption,
  LayoutSelector,
} from "@/lib/components/Common/LayoutSelector";

import Link from "next/link";
import FormCardList from "./FormCardList";
import { URLs } from "@/lib/constants/urls";
import { TableIcon, GridIcon } from "lucide-react";
import FormsTable from "@/lib/components/Pages/Forms/FormsTable";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { useLayoutState } from "@/lib/components/Common/ConditionalSelector";
import { Button } from "@/lib/ui/button";

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
        <Button asChild variant="default" size="sm">
          <Link href={URLs.admin.forms.create}>Create Form</Link>
        </Button>

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
