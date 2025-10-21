"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { FieldsType } from "@/lib/types/form/fields";
import FieldSidebarItem from "./FieldSidebarItem";
import {
  getInputFieldTypes,
  getDisplayElementTypes,
} from "@/lib/constants/formFields";
import { Button } from "@/lib/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/accordion";

type FieldsSidebarProps = {
  onDoubleClick?: (fieldType: FieldsType) => void;
};

const FieldsSidebar = ({ onDoubleClick }: FieldsSidebarProps) => {
  const inputFieldTypes = getInputFieldTypes();
  const displayElementTypes = getDisplayElementTypes();

  const [inputFieldsOpen, setInputFieldsOpen] = useState(true);
  const [displayElementsOpen, setDisplayElementsOpen] = useState(true);

  return (
    <div className="max-w-xs">
      <p className="text-xs text-gray-500 mb-4">
        Drag or double-click to add fields
      </p>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Input Fields</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {inputFieldTypes.map((type) => (
              <FieldSidebarItem
                key={type}
                type={type}
                onDoubleClick={onDoubleClick}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Display Elements</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {displayElementTypes.map((type) => (
              <FieldSidebarItem
                key={type}
                type={type}
                onDoubleClick={onDoubleClick}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FieldsSidebar;
