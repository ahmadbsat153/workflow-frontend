"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";

import FormInformation, {
  FormInformationData,
  formInformationSchema,
} from "./FormInformation";
import { toast } from "sonner";
import { Button } from "@/lib/ui/button";
import DnDContainer from "./DnDContainer";
import FieldsSidebar from "./FieldsSidebar";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import FieldSidebarItem from "./FieldSidebarItem";
import { ErrorResponse } from "@/lib/types/common";
import { getUrl, URLs } from "@/lib/constants/urls";
import { handleServerError } from "@/lib/api/_axios";
import { useParams, useRouter } from "next/navigation";
import DotsLoader from "@/lib/components/Loader/DotsLoader";
import { API_FORM } from "@/lib/services/Form/form_service";
import { Field, FieldsType, FieldWidth } from "@/lib/types/form/fields";
import {
  createFieldFromType,
  getFieldTypeIcon,
  isDisplayElement,
} from "@/lib/constants/formFields";
import { ChevronLeftIcon, Trash2Icon } from "lucide-react";
import AlertModal from "@/lib/components/Alert/AlertModal";

const FormBuilder = () => {
  const router = useRouter();

  const params = useParams();
  const form_id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [droppedFields, setDroppedFields] = useState<Field[]>([]);
  const [activeField, setActiveField] = useState<FieldsType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<FieldWidth>(100);
  const [formInfo, setFormInfo] = useState<FormInformationData>({
    title: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    getForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form_id]);

  const getForm = async () => {
    if (!form_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const result = await API_FORM.getFormById(form_id);
      const info = {
        title: result.name,
        description: result.description,
        isActive: result.isActive,
      };

      setFormInfo(info);
      setDroppedFields([...result.fields]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [formInfoErrors, setFormInfoErrors] = useState<
    Partial<Record<keyof FormInformationData, string>>
  >({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Custom collision detection - prioritize drop zone when dragging from sidebar
  const customCollisionDetection = (args: any) => {
    // When dragging a new field from sidebar
    if (activeField) {
      // First check if pointer is within any droppable
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }
      // Fallback to rectangle intersection
      return rectIntersection(args);
    }
    // When reordering existing fields, use closest center
    return closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const fieldType = active.data.current?.type as FieldsType;

    if (fieldType) {
      setActiveField(fieldType);
      setActiveId(null);
    } else {
      setActiveId(active.id as string);
      setActiveField(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);

    if (
      activeField &&
      over?.id &&
      over.id !== "drop-zone" &&
      over.id !== "drop-zone-end"
    ) {
      const overIndex = droppedFields.findIndex((f) => f.name === over.id);
      if (overIndex !== -1) {
        if (overIndex > 0) {
          const prevField = droppedFields[overIndex - 1];
          const prevWidth = (prevField.style?.width as FieldWidth) ?? 100;

          if (prevWidth < 100) {
            const remainingSpace = 100 - prevWidth;
            let calculatedWidth: FieldWidth = 100;
            if (remainingSpace >= 66) calculatedWidth = 66;
            else if (remainingSpace >= 50) calculatedWidth = 50;
            else if (remainingSpace >= 33) calculatedWidth = 33;
            else calculatedWidth = 100;

            setPreviewWidth(calculatedWidth);
          } else {
            setPreviewWidth(100);
          }
        } else {
          setPreviewWidth(100);
        }
      }
    } else if (
      activeField &&
      (over?.id === "drop-zone" || over?.id === "drop-zone-end")
    ) {
      if (droppedFields.length > 0) {
        const lastField = droppedFields[droppedFields.length - 1];
        const lastWidth = (lastField.style?.width as FieldWidth) ?? 100;

        if (lastWidth < 100) {
          const remainingSpace = 100 - lastWidth;
          let calculatedWidth: FieldWidth = 100;

          if (remainingSpace >= 66) calculatedWidth = 66;
          else if (remainingSpace >= 50) calculatedWidth = 50;
          else if (remainingSpace >= 33) calculatedWidth = 33;
          else calculatedWidth = 100;

          setPreviewWidth(calculatedWidth);
        } else {
          setPreviewWidth(100);
        }
      } else {
        setPreviewWidth(100);
      }
    } else {
      setPreviewWidth(100);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveField(null);
      setActiveId(null);
      setOverId(null);
      return;
    }

    if (activeField) {
      let insertIndex = droppedFields.length;
      let calculatedWidth: FieldWidth = 100;

      if (over.id !== "drop-zone" && over.id !== "drop-zone-end") {
        const overIndex = droppedFields.findIndex((f) => f.name === over.id);
        if (overIndex !== -1) {
          insertIndex = overIndex;

          if (insertIndex > 0) {
            const prevField = droppedFields[insertIndex - 1];
            const prevWidth = (prevField.style?.width as FieldWidth) ?? 100;

            if (prevWidth < 100) {
              const remainingSpace = 100 - prevWidth;
              if (remainingSpace >= 66) calculatedWidth = 66;
              else if (remainingSpace >= 50) calculatedWidth = 50;
              else if (remainingSpace >= 33) calculatedWidth = 33;
              else calculatedWidth = 100;
            } else {
              calculatedWidth = 100;
            }
          } else {
            calculatedWidth = 100;
          }
        }
      } else {
        insertIndex = droppedFields.length;

        if (droppedFields.length > 0) {
          const lastField = droppedFields[droppedFields.length - 1];
          const lastWidth = (lastField.style?.width as FieldWidth) ?? 100;

          if (lastWidth < 100) {
            const remainingSpace = 100 - lastWidth;
            if (remainingSpace >= 66) calculatedWidth = 66;
            else if (remainingSpace >= 50) calculatedWidth = 50;
            else if (remainingSpace >= 33) calculatedWidth = 33;
            else calculatedWidth = 100;
          } else {
            calculatedWidth = 100;
          }
        }
      }

      const newField = createFieldFromType(activeField, {
        name: `${activeField}_${Date.now()}`,
        order: insertIndex,
        style: { width: calculatedWidth },
      });

      setDroppedFields((prev) => {
        const newFields = [...prev];
        newFields.splice(insertIndex, 0, newField);
        return newFields.map((field, index) => ({
          ...field,
          order: index,
        }));
      });
    } else if (activeId && active.id !== over.id) {
      setDroppedFields((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        let newIndex = items.findIndex((item) => item.name === over.id);

        if (String(over.id) === "drop-zone-end") {
          newIndex = items.length - 1;
        }

        if (oldIndex === -1 || newIndex === -1) return items;

        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        return reorderedItems.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }

    setActiveField(null);
    setActiveId(null);
    setOverId(null);
  };

  const handleDoubleClickField = (fieldType: FieldsType) => {
    let calculatedWidth: FieldWidth = 100;

    if (droppedFields.length > 0) {
      let currentRowWidth = 0;
      let lastCompleteRowIndex = -1;

      let cumulativeWidth = 0;
      for (let i = 0; i < droppedFields.length; i++) {
        const fieldWidth = (droppedFields[i].style?.width as FieldWidth) ?? 100;

        if (fieldWidth === 100) {
          lastCompleteRowIndex = i;
          cumulativeWidth = 0;
        } else {
          cumulativeWidth += fieldWidth;
          if (cumulativeWidth >= 100) {
            lastCompleteRowIndex = i;
            cumulativeWidth = 0;
          }
        }
      }

      for (let i = lastCompleteRowIndex + 1; i < droppedFields.length; i++) {
        const fieldWidth = (droppedFields[i].style?.width as FieldWidth) ?? 100;
        currentRowWidth += fieldWidth;
      }

      if (currentRowWidth > 0 && currentRowWidth < 100) {
        let remainingSpace = 100 - currentRowWidth;

        if (remainingSpace === 67) remainingSpace = 66;
        if (remainingSpace === 34) remainingSpace = 33;

        if ([25, 33, 50, 66, 75].includes(remainingSpace)) {
          calculatedWidth = remainingSpace as FieldWidth;
        } else {
          calculatedWidth = 100;
        }
      }
    }

    const newField = createFieldFromType(fieldType, {
      name: `${fieldType}_${Date.now()}`,
      order: droppedFields.length,
      style: { width: calculatedWidth },
    });

    setDroppedFields((prev) => [...prev, newField]);
  };

  const handleDragCancel = () => {
    setActiveField(null);
    setActiveId(null);
    setOverId(null);
  };

  const cleanFieldForSubmission = (field: Field): any => {
    const isDisplay = isDisplayElement(field.type);

    // Remove undefined and empty string values
    const removeEmpty = (obj: any) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined && v !== "")
      );
    };

    if (isDisplay) {
      // For display elements, only keep these properties
      const cleanField: any = {
        name: field.name,
        type: field.type,
        order: field.order,
      };

      // Only add _id if it exists (for updates)
      if (field._id) {
        cleanField._id = field._id;
      }

      // Add content if it exists and has values
      if (field.content && Object.keys(field.content).length > 0) {
        cleanField.content = removeEmpty(field.content);
      }

      // Add style if it exists and has values
      if (field.style) {
        const cleanStyle = removeEmpty(field.style);
        if (Object.keys(cleanStyle).length > 0) {
          cleanField.style = cleanStyle;
        }
      }

      return cleanField;
    } else {
      // For input fields, keep all input-related properties
      const cleanField: any = {
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required ?? false,
        order: field.order,
      };

      // Only add _id if it exists (for updates)
      if (field._id) {
        cleanField._id = field._id;
      }

      // Add optional properties only if they have values
      if (field.placeholder) {
        cleanField.placeholder = field.placeholder;
      }

      if (field.defaultValue !== undefined && field.defaultValue !== "") {
        cleanField.defaultValue = field.defaultValue;
      }

      if (field.options && field.options.length > 0) {
        cleanField.options = field.options;
      }

      if (field.validation && Object.keys(field.validation).length > 0) {
        cleanField.validation = removeEmpty(field.validation);
      }

      if (field.display) {
        cleanField.display = field.display;
      }

      if (field.autofill) {
        cleanField.autofill = field.autofill;
      }

      // Add tableConfig for TABLE field type
      if (field.tableConfig) {
        cleanField.tableConfig = field.tableConfig;
      }

      // Add style if it exists
      if (field.style) {
        const cleanStyle = removeEmpty(field.style);
        if (Object.keys(cleanStyle).length > 0) {
          cleanField.style = cleanStyle;
        }
      }

      return cleanField;
    }
  };
  const handleSaveForm = async () => {
    const result = formInformationSchema.safeParse(formInfo);

    if (!result.success) {
      const errors: Partial<Record<keyof FormInformationData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof FormInformationData] = issue.message;
        }
      });
      setFormInfoErrors(errors);
      return;
    }

    setFormInfoErrors({});

    // Clean fields before submission
    const cleanedFields = droppedFields.map(cleanFieldForSubmission);

    const data = {
      name: formInfo.title,
      description: formInfo.description,
      isActive: formInfo.isActive,
      fields: cleanedFields,
    };

    setLoading(true);
    const id = "form-create";

    try {
      await API_FORM.createForm(data);
      toast.success("Form Created Successfully", { id });
      router.push(getUrl(URLs.admin.forms.index));
    } catch (error) {
      handleServerError(error as ErrorResponse, (msg) => {
        toast.error(`${msg}`, { id });
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateForm = async () => {


    const result = formInformationSchema.safeParse(formInfo);

    if (!result.success) {
      const errors: Partial<Record<keyof FormInformationData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof FormInformationData] = issue.message;
        }
      });
      setFormInfoErrors(errors);
      return;
    }

    setFormInfoErrors({});

    console.log(droppedFields)
    // Clean fields before submission
    const cleanedFields = droppedFields.map(cleanFieldForSubmission);

    const data = {
      name: formInfo.title,
      description: formInfo.description,
      isActive: formInfo.isActive,
      fields: cleanedFields,
    };

    console.log(cleanedFields)
    setLoading(true);
    const id = "form-update";

    try {
      await API_FORM.updateFormById(form_id, data);
      toast.success("Form Updated Successfully", { id });
      router.push(getUrl(URLs.admin.forms.index));
    } catch (error) {
      handleServerError(error as ErrorResponse, (msg) => {
        toast.error(`${msg}`, { id });
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col overflow-hidden  bg-gray-50">
        <div className="py-5 px-4 flex-shrink-0">
          <Button
            variant={"secondary"}
            onClick={() => router.back()}
            size={"sm"}
          >
            <ChevronLeftIcon /> Go Back
          </Button>
        </div>
        <div className="flex flex-1 overflow-hidden max-h-[80vh]">
          <div className="w-64 flex-shrink-0 p-4 flex flex-col overflow-hidden">
            <FieldsSidebar onDoubleClick={handleDoubleClickField} />
          </div>
          <div className="flex-1 px-5 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar">
              <DnDContainer
                droppedFields={droppedFields}
                setDroppedFields={setDroppedFields}
                overId={overId}
                activeId={activeId}
              />
            </div>

            <div className="flex justify-end py-4 flex-shrink-0">
              <AlertModal
                title="Remove all fields"
                description="Are you sure you want to remove all fields? This action cannot be undone."
                handleAction={() => setDroppedFields([])}
              >
                <div className="flex text-sm text-destructive items-center justify-center gap-2 cursor-pointer select-none">
                  <Trash2Icon className="!size-5" /> Remove all fields
                </div>
              </AlertModal>
            </div>
          </div>
          <div className="w-80 flex-shrink-0 overflow-y-auto scrollbar p-4">
            <FormInformation
              formInfo={formInfo}
              setFormInfo={setFormInfo}
              errors={formInfoErrors}
            />
            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                isLoading={loading}
                type="submit"
                disabled={loading || droppedFields.length === 0}
                onClick={form_id ? handleUpdateForm : handleSaveForm}
                className="w-full px-4 py-4 font-semibold text-xs"
              >
                {loading ? "Saving..." : "Save Form"}
              </Button>
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeField ? (
            <DragPreview type={activeField} width={previewWidth} />
          ) : activeId ? (
            <DragPreviewField
              field={droppedFields.find((f) => f.name === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

const DragPreview = ({
  type,
  width,
}: {
  type: FieldsType;
  width: FieldWidth;
}) => {
  return (
    <div className="opacity-90 bg-white border-2 border-gray-200 rounded-lg p-3 shadow-xl max-w-[400px]">
      <FieldSidebarItem type={type} />
      <div className="mt-2 text-xs text-primary font-medium text-center">
        Will be placed at {width}% width
      </div>
    </div>
  );
};

const DragPreviewField = ({ field }: { field: Field }) => {
  const Icon = getFieldTypeIcon(field.type);
  // const width = (field.style?.width as FieldWidth) ?? 100;

  return (
    <div className="bg-white border-2 border-pumpkin rounded-lg p-4 shadow-xl opacity-90 max-w-[400px]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-5" />
        <label className="font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {/* <div className="text-xs text-blue-500 font-medium">Width: {width}%</div> */}
    </div>
  );
};

export default FormBuilder;
