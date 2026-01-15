"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/accordion";

import {
  getInputFieldTypes,
  getDisplayElementTypes,
} from "@/lib/constants/formFields";

import { Input } from "@/lib/ui/input";
import {SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import FieldSidebarItem from "./FieldSidebarItem";
import { FieldsType } from "@/lib/types/form/fields";

type FieldsSidebarProps = {
  onDoubleClick?: (fieldType: FieldsType) => void;
};

const FieldsSidebar = ({ onDoubleClick }: FieldsSidebarProps) => {
  const inputFieldTypes = getInputFieldTypes();
  const displayElementTypes = getDisplayElementTypes();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter fields based on search query
  const filteredInputFields = useMemo(() => {
    if (!searchQuery.trim()) return inputFieldTypes;
    return inputFieldTypes.filter((type) =>
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inputFieldTypes, searchQuery]);

  const filteredDisplayElements = useMemo(() => {
    if (!searchQuery.trim()) return displayElementTypes;
    return displayElementTypes.filter((type) =>
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayElementTypes, searchQuery]);

  return (
    <div className="flex flex-col h-full max-w-xs">
      {/* Fixed header section */}
      <div className="flex-shrink-0 mb-4">
        <p className="text-xs text-gray-500 mb-4">
          Drag or double-click to add fields
        </p>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Scrollable fields section */}
      <div className="flex-1 overflow-y-auto scrollbar pr-2">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["item-1", "item-2"]}
        >
          {filteredInputFields.length > 0 && (
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Input Fields ({filteredInputFields.length})
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {filteredInputFields.map((type) => (
                  <FieldSidebarItem
                    key={type}
                    type={type}
                    onDoubleClick={onDoubleClick}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          {filteredDisplayElements.length > 0 && (
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Display Elements ({filteredDisplayElements.length})
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {filteredDisplayElements.map((type) => (
                  <FieldSidebarItem
                    key={type}
                    type={type}
                    onDoubleClick={onDoubleClick}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* No results message */}
        {searchQuery.trim() &&
          filteredInputFields.length === 0 &&
          filteredDisplayElements.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-4">
              No fields found matching &quot;{searchQuery}&quot;
            </div>
          )}
      </div>
    </div>
  );
};

export default FieldsSidebar;
