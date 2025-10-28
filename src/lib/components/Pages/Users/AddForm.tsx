"use client";

import { FieldsType } from "@/lib/types/form/fields";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Switch } from "@/lib/ui/switch";
type Props = {
  inputValues: {
    [key: string]: any;
  };
  setInputValues: Function;
  fields: UserFormField[];
  addFunction: Function;
  onClose: Function;
  loading: boolean;
  inputValuesProps: {
    [key: string]: any;
  };
};

type FieldRestrictionObject = {
  [key: string]: any;
};

type SelectOptions = {
  label: string;
  value: any;
};

type UserFormField = {
  _id: string;
  name: string;
  label: string;
  description?: string;
  type: FieldsType;
  required: boolean;
  placeholder: string;
  defaultValue: string | number | boolean;
  options?: SelectOptions[];
  restrictions?: FieldRestrictionObject;
  order?: number;
  style?: string;
};

//Dynamic Add Form
const AddForm = ({
  inputValues,
  setInputValues,
  fields,
  addFunction,
  onClose,
  loading,
}: Props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: UserFormField
  ) => {
    setInputValues({ ...inputValues, [field._id]: e.target.value });
  };
  const renderField = (field: UserFormField) => {
    switch (field.type) {
      case FieldsType.TEXT:
        return (
          <Input
            variant="outline"
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            label={field.label}
            type={"text"}
            className={field?.style}
            onChange={(e) => handleChange(e, field)}
            name={field.name}
          />
        );
      case FieldsType.NUMBER:
        return (
          <Input
            type="number"
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            className={field?.style}
            onChange={(e) => handleChange(e, field)}
            name={field.name}
          />
        );
      case FieldsType.TEXT_AREA:
        return (
          <textarea
            rows={field.restrictions?.length || 4}
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            className={field?.style}
            onChange={(e) =>
              setInputValues({ ...inputValues, [field._id]: e.target.value })
            }
            name={field.name}
          />
        );
      case FieldsType.SELECT:
        return (
          <div className={field?.style}>
            <Label className="mb-2">{field.label}</Label>
            <Select
              defaultValue={inputValues[field._id]}
              value={inputValues[field._id]}
              autoComplete={
                field?.restrictions?.hasOwnProperty("autocomplete")
                  ? field?.restrictions?.autocomplete
                  : "off"
              }
              name={field.name}
              key={field._id}
              onValueChange={(value) =>
                setInputValues({ ...inputValues, [field._id]: value })
              }
            >
              <SelectTrigger value={inputValues[field._id]} className="w-full">
                <SelectValue placeholder={field.label} />
              </SelectTrigger>
              <SelectContent className={field?.style}>
                {field.options?.map((option, index) => (
                  <SelectItem key={option.label + index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case FieldsType.CHECKBOX:
        return (
          <div
            className={`flex items-center gap-2 w-full ${
              field?.style?.includes("col-span-2") ? "col-span-2" : "col-span-1"
            }`}
          >
            <div className="flex flex-row items-center justify-between w-full rounded-lg border p-4 gap-5">
              <div className="space-y-0.5">
                <Label className="text-base">{field.label}</Label>
                <div className="text-sm text-muted-foreground">
                  {field.description}
                </div>
              </div>
              <Switch
                checked={inputValues[field._id]}
                onCheckedChange={(value) =>
                  setInputValues({ ...inputValues, [field._id]: value })
                }
                disabled={loading}
              />
            </div>
          </div>
        );
      case FieldsType.RADIO:
        return (
          <div
            className={`flex items-center gap-2 ${
              field?.style?.includes("col-span-2") ? "col-span-2" : "col-span-1"
            }`}
          >
            <Label>{field.label}</Label>
            <Input
              className={field?.style}
              checked={inputValues[field._id]}
              defaultValue={inputValues[field._id]}
              defaultChecked={inputValues[field._id]}
              onChange={(e) =>
                setInputValues({ ...inputValues, [field._id]: e.target.value })
              }
              type="radio"
              name={field.name}
            />
          </div>
        );
      case FieldsType.DATE:
        return (
          <Input
            onChange={(e) =>
              setInputValues({ ...inputValues, [field._id]: e.target.value })
            }
            className={field?.style}
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            type="date"
            name={field.name}
          />
        );
      case FieldsType.EMAIL:
        return (
          <Input
            variant="outline"
            label={field.label}
            type={"email"}
            className={field?.style}
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            onChange={(e) => handleChange(e, field)}
            name={field.name}
          />
        );
      default:
        return (
          <Input
            variant="outline"
            label={field.label}
            type={"text"}
            className={field?.style}
            defaultValue={inputValues[field._id]}
            value={inputValues[field._id]}
            onChange={(e) => handleChange(e, field)}
            name={field.name}
          />
        );
    }
  };

  return (
    <div>
      <form
        className="w-full h-full flex flex-col gap-[6rem] min-h-full relative"
        onSubmit={(e) => addFunction(e)}
      >
        {/* Render fields dynamically based on field type */}
        <div className="grid grid-cols-2 gap-5">
          {fields.map((field: UserFormField) => renderField(field))}
        </div>
        <div className="flex items-center gap-3 justify-end">
          <Button
            isDisabled={loading}
            size="lg"
            variant="outline"
            type="button"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            isDisabled={loading}
            isLoading={loading}
            type="submit"
            size="lg"
            variant="default"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
