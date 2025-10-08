"use client";

import { Button } from "@/lib/ui/button";
import { SettingsIcon, TrashIcon, GripVertical } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { 
  SortableContext, 
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field, FieldWidth } from "@/lib/types/form/fields";
import { getFieldTypeIcon } from "@/lib/constants/formFields";
import FieldSettingsSheet from "./FieldSettingsSheet";
import { renderFieldPreview } from "@/utils/fieldUtils";
import { Dispatch, SetStateAction, useRef, useState } from "react";

type DnDContainerProps = {
  droppedFields: Field[];
  setDroppedFields: Dispatch<SetStateAction<Field[]>>;
};

const DnDContainer = ({
  droppedFields,
  setDroppedFields,
}: DnDContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-zone",
  });

  const handleDeleteField = (fieldName: string) => {
    setDroppedFields((prev) =>
      prev.filter((field) => field.name !== fieldName).map((field, index) => ({
        ...field,
        order: index,
      }))
    );
  };

  const handleUpdateField = (
    fieldName: string,
    updatedData: Partial<Field>
  ) => {
    setDroppedFields((prev) =>
      prev.map((field) =>
        field.name === fieldName ? { ...field, ...updatedData } : field
      )
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`border-dashed border-2 p-4 transition-colors min-h-[400px] ${
        isOver ? "bg-blue-50 border-blue-400" : "bg-red-50 border-gray-300"
      }`}
    >
      {droppedFields.length === 0 ? (
        <p className="text-gray-400 text-center">Drag and Drop Fields Here</p>
      ) : (
        <SortableContext
          items={droppedFields.map((field) => field.name)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-4">
            {droppedFields.map((field) => (
              <SortableFieldInput
                key={field.name}
                field={field}
                onDelete={() => handleDeleteField(field.name)}
                onUpdate={(updatedData) =>
                  handleUpdateField(field.name, updatedData)
                }
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

const SortableFieldInput = ({
  field,
  onDelete,
  onUpdate,
}: {
  field: Field;
  onDelete: () => void;
  onUpdate: (updatedData: Partial<Field>) => void;
}) => {
  const [isResizing, setIsResizing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.name,
    disabled: isResizing, // Disable sorting while resizing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? 'none' : transition, // No transition while resizing
  };

  const Icon = getFieldTypeIcon(field.type);
  const containerRef = useRef<HTMLDivElement>(null);
  const width = (field.style?.width as FieldWidth) ?? 100;

  const snapToWidth = (percentage: number): FieldWidth => {
    if (percentage <= 29) return 25;
    if (percentage <= 41) return 33;
    if (percentage <= 58) return 50;
    if (percentage <= 70) return 66;
    if (percentage <= 87) return 75;
    return 100;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    // Get the flex container (the wrapper with flex-wrap)
    const flexContainer = containerRef.current?.parentElement?.parentElement;
    if (!flexContainer) return;

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = flexContainer.getBoundingClientRect().width;
      
      // Calculate percentage change based on mouse movement
      const deltaPercentage = (deltaX / containerWidth) * 100;
      const newPercentage = startWidth + deltaPercentage;
      
      const snappedWidth = snapToWidth(Math.max(0, Math.min(100, newPercentage)));
      
      // Only update if the width actually changed
      if (snappedWidth !== width) {
        onUpdate({ style: { width: snappedWidth } });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getFlexBasis = () => {
    if (width === 100) return "100%";
    if (width === 50) return "calc(50% - 0.5rem)";
    if (width === 33) return "calc(33.333% - 0.667rem)";
    if (width === 66) return "calc(66.666% - 0.333rem)";
    if (width === 25) return "calc(25% - 0.75rem)";
    if (width === 75) return "calc(75% - 0.25rem)";
    return `${width}%`;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        flexBasis: getFlexBasis(),
        flexGrow: 0,
        flexShrink: 0,
      }}
      className={`relative ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      <div
        ref={containerRef}
        className="p-4 border rounded-lg bg-white hover:border-blue-400 transition-colors group"
      >
        {/* Drag handle for sorting - with touch-action to prevent conflicts */}
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-gray-200 p-1 rounded touch-none"
          style={{ touchAction: 'none' }}
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </button>

        {/* Resize handle - separate from drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10 touch-none"
          style={{ touchAction: 'none' }}
        >
          <div className="bg-blue-200 py-2 px-1 rounded-full">
            <GripVertical className="w-3 h-3 text-blue-600" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="size-5" />
            <label className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <div className="text-xs text-blue-500 font-medium min-w-[3ch]">
              {width}%
            </div>
            {field.order !== undefined && (
              <div className="text-xs text-gray-400 font-medium">
                #{field.order}
              </div>
            )}
            <FieldSettingsSheet field={field} onUpdate={onUpdate}>
              <Button size="icon" variant="ghost" className="p-1">
                <SettingsIcon className="!size-5" />
              </Button>
            </FieldSettingsSheet>

            <Button
              size="icon"
              variant="ghost"
              className="p-1"
              onClick={onDelete}
            >
              <TrashIcon className="!size-5 text-destructive" />
            </Button>
          </div>
        </div>
        {renderFieldPreview(field)}
        {/* Optional: Show validation rules */}
        {field.validation && Object.keys(field.validation).length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Validation:</span>{" "}
            {JSON.stringify(field.validation)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DnDContainer;