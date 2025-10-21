"use client";

import { Button } from "@/lib/ui/button";
import { SettingsIcon, TrashIcon, GripVertical } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field, FieldWidth } from "@/lib/types/form/fields";
import { getFieldTypeIcon, isDisplayElement } from "@/lib/constants/formFields";
import FieldSettingsSheet from "./FieldSettingsSheet";
import { renderFieldPreview } from "@/utils/fieldUtils";
import { Dispatch, SetStateAction, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";

type DnDContainerProps = {
  droppedFields: Field[];
  setDroppedFields: Dispatch<SetStateAction<Field[]>>;
  overId: string | null;
  activeId: string | null;
};

const DnDContainer = ({
  droppedFields,
  setDroppedFields,
  overId,
  activeId,
}: DnDContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-zone",
  });

  const handleDeleteField = (fieldName: string) => {
    setDroppedFields((prev) =>
      prev
        .filter((field) => field.name !== fieldName)
        .map((field, index) => ({
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
      className={`border-dashed border-2 p-4 transition-colors min-h-[400px] max-h-[75vh] overflow-y-auto scrollbar ${
        isOver ? "bg-blue-50 border-blue-400" : "bg-red-50 border-gray-300"
      }`}
    >
      {droppedFields.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-center">Drag and Drop Fields Here</p>
        </div>
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
                showDropIndicator={
                  overId === field.name && activeId !== field.name
                }
              />
            ))}

            {/* Drop zone at the end */}
            <DropZoneEnd showIndicator={overId === "drop-zone-end"} />
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
  showDropIndicator = false,
}: {
  field: Field;
  onDelete: () => void;
  onUpdate: (updatedData: Partial<Field>) => void;
  showDropIndicator?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getFieldTypeIcon(field.type);
  const containerRef = useRef<HTMLDivElement>(null);
  const width = (field.style?.width as FieldWidth) ?? 100;
  const isDisplay = isDisplayElement(field.type);

  const getFlexBasis = () => {
    if (width === 100) return "100%";
    if (width === 50) return "calc(50% - 0.5rem)";
    if (width === 33) return "calc(33.333% - 0.667rem)";
    if (width === 66) return "calc(66.666% - 0.333rem)";
    if (width === 25) return "calc(25% - 0.75rem)";
    if (width === 75) return "calc(75% - 0.25rem)";
    return `${width}%`;
  };

  const widthOptions: FieldWidth[] = [33, 50, 66, 100];

  // Get display name for the field
  const getFieldDisplayName = () => {
    if (isDisplay) {
      // For display elements, show the type name
      const typeLabel =
        field.type.charAt(0).toUpperCase() + field.type.slice(1);
      return typeLabel;
    }
    return field.label;
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
      className={`relative ${isDragging ? "opacity-50 z-50" : ""}`}
    >
      {/* Drop indicator line - shows before this field */}
      {showDropIndicator && (
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-30 animate-pulse shadow-lg">
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`border rounded-lg bg-white hover:border-blue-400 transition-colors group `}
      >
        {/* Drag handle for sorting */}
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-gray-200 p-1 rounded touch-none"
          style={{ touchAction: "none" }}
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Icon className={`size-5`} />
            <label className={`font-medium text-sm `}>
              {getFieldDisplayName()}
              {!isDisplay && field.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
          </div>

          <div className="flex items-center gap-2">
            {/* Only show width selector for non-display elements */}
            {!isDisplay && (
              <Select
                value={width.toString()}
                onValueChange={(value) =>
                  onUpdate({
                    style: {
                      ...field.style,
                      width: Number(value) as FieldWidth,
                    },
                  })
                }
              >
                <SelectTrigger
                  size="sm"
                  className="text-xs text-blue-500 font-medium bg-white hover:bg-blue-50 w-[70px] cursor-pointer"
                >
                  {width}%
                </SelectTrigger>
                <SelectContent>
                  {widthOptions.map((w) => (
                    <SelectItem
                      key={w}
                      value={w.toString()}
                      className="cursor-pointer"
                    >
                      {w}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Display elements can still have width, but shown as a badge */}
            {isDisplay && width !== 100 && (
              <span className="text-xsfont-medium px-2 py-1 rounded">
                {width}%
              </span>
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
      </div>
    </div>
  );
};

export default DnDContainer;

// Drop zone component for the end of the list
const DropZoneEnd = ({ showIndicator }: { showIndicator: boolean }) => {
  const { setNodeRef } = useDroppable({
    id: "drop-zone-end",
  });

  return (
    <div
      ref={setNodeRef}
      className="relative flex-grow min-w-[200px] min-h-[80px] flex items-center justify-center"
    >
      {showIndicator && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-30 animate-pulse shadow-lg">
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}
      <p className="text-gray-300 text-sm">Drop here to add at end</p>
    </div>
  );
};
