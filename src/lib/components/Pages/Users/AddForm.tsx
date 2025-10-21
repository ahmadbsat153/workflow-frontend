"use client";

import { FieldsType } from "@/lib/types/form/fields";
import { Button } from "@/lib/ui/button";
import { Checkbox } from "@/lib/ui/checkbox";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
interface Props {
  inputValues: {
    [key: string]: any;
  };
  setInputValues: Function;
  fields: Field[];
  addFunction: Function;
  onClose: Function;
  loading: boolean;
  inputValuesProps: {
    [key: string]: any;
  };
}

interface FieldRestrictionObject {
  [key: string]: any;
}

interface SelectOptions {
  label: string;
  value: any;
}

interface Field {
  _id: string;
  name: string;
  label: string;
  type: FieldsType;
  required: boolean;
  placeholder: string;
  defaultValue: string | number | boolean;
  options?: SelectOptions[];
  restrictions?: FieldRestrictionObject;
  order?: number;
  style?: string;
}

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
    field: Field
  ) => {
    setInputValues({ ...inputValues, [field._id]: e.target.value });
  };
  const renderField = (field: Field) => {
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
          <div className={`flex items-center gap-2 ${field?.style?.includes("col-span-2") ? "col-span-2" : "col-span-1"}`}>
            <Label>{field.label}</Label>
            <Checkbox
              name={field.name}
              value={inputValues[field._id]}
              defaultChecked={inputValues[field._id]}
              className={field?.style}
              checked={inputValues[field._id]}
              onCheckedChange={(value) =>
                setInputValues({ ...inputValues, [field._id]: value })
              }
            />
          </div>
        );
      case FieldsType.RADIO:
        return (
          <div className={`flex items-center gap-2 ${field?.style?.includes("col-span-2") ? "col-span-2" : "col-span-1"}`}>
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
      <form className="w-full h-full flex flex-col gap-[6rem] min-h-full relative" onSubmit={(e) => addFunction(e)}>
        {/* Render fields dynamically based on field type */}
        <div className="grid grid-cols-2 gap-5">
            {fields.map((field: Field) => renderField(field))}
        </div>
        <div className="flex items-center gap-6 justify-end">
          <Button isDisabled={loading} size="md" variant="ghost" type="button" onClick={()=>onClose()} className="transition-all hover:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:bg-opacity-0">
            Cancel
          </Button>
          <Button
            isDisabled={loading}
            isLoading={loading}
            type="submit"
            size="md"
            className="transition-all hover:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:bg-opacity-0"
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
