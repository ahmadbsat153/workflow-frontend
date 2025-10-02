"use client";

import { cn } from "@/lib/utils";
import { Move } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { FieldsType } from "@/lib/types/form/fields";
import { getFieldTypeIcon } from "@/lib/constants/formFields";
import { SidebarMenuItem } from "@/lib/ui/sidebar";

type propsType = {
  type: FieldsType;
};

const FieldSidebarItem = ({ type }: propsType) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type },
  });
  const Icon = getFieldTypeIcon(type);
  return (
    <SidebarMenuItem
      key={type}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        isDragging ? "opacity-50" : "opacity-100",
        "flex justify-between items-center p-2 text-sm border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="!size-5 text-primary" />
        <span className="capitalize">{type}</span>
      </div>
      <Move className="!size-3 text-gray-500" />
    </SidebarMenuItem>
  );
};
export default FieldSidebarItem;
