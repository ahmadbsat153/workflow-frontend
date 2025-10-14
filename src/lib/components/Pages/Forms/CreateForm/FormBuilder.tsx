"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { useEffect, useState } from "react";
import { Button } from "@/lib/ui/button";
import DnDContainer from "./DnDContainer";
import FieldsSidebar from "./FieldsSidebar";
import FieldSidebarItem from "./FieldSidebarItem";
import { Field, FieldsType } from "@/lib/types/form/fields";
import { createFieldFromType } from "@/lib/constants/formFields";
import FormInformation, {
  FormInformationData,
  formInformationSchema,
} from "./FormInformation";
import { API_FORM } from "@/lib/services/Form/form_service";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { getUrl, URLs } from "@/lib/constants/urls";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { title } from "process";
import DotsLoader from "@/lib/components/Loader/DotsLoader";

const FormBuilder = () => {
  const router = useRouter();

  const params = useParams();
  const form_id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [droppedFields, setDroppedFields] = useState<Field[]>([]);
  const [activeField, setActiveField] = useState<FieldsType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveField(null);
      setActiveId(null);
      return;
    }

    if (activeField && over.id === "drop-zone") {
      const newField = createFieldFromType(activeField, {
        name: `${activeField}_${Date.now()}`,
        order: droppedFields.length,
      });
      setDroppedFields((prev) => [...prev, newField]);
    } else if (activeId && active.id !== over.id) {
      setDroppedFields((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        const newIndex = items.findIndex((item) => item.name === over.id);

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
  };

  const handleDragCancel = () => {
    setActiveField(null);
    setActiveId(null);
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

    const data = {
      name: formInfo.title,
      description: formInfo.description,
      isActive: formInfo.isActive,
      fields: droppedFields,
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

    const data = {
      name: formInfo.title,
      description: formInfo.description,
      isActive: formInfo.isActive,
      fields: droppedFields,
    };

    setLoading(true);

    const id = "form-create";

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
      <div className="h-screen flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full">
        <FieldsSidebar />
        <div className="p-2 h-full overflow-y-scroll flex-1 bg-gray-50 px-20 py-5">
          <div className="flex justify-end mb-4">
            <Button
              size="lg"
              isLoading={loading}
              type="submit"
              disabled={loading || droppedFields.length === 0}
              onClick={form_id ? handleUpdateForm : handleSaveForm}
              className="w-full px-4 py-4 text-base font-semibold"
            >
              {loading ? "Saving..." : "Save Form"}
            </Button>
          </div>

          <FormInformation
            formInfo={formInfo}
            setFormInfo={setFormInfo}
            errors={formInfoErrors}
          />

          <DnDContainer
            droppedFields={droppedFields}
            setDroppedFields={setDroppedFields}
          />
        </div>
      </div>

      <DragOverlay>
        {activeField ? (
          <DragPreview type={activeField} />
        ) : activeId ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-xl opacity-90">
            <p className="text-sm font-medium">Reordering field...</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const DragPreview = ({ type }: { type: FieldsType }) => {
  return (
    <div className="opacity-80">
      <FieldSidebarItem type={type} />
    </div>
  );
};

export default FormBuilder;
