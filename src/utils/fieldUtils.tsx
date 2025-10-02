import { Field, FieldsType } from "@/lib/types/form/fields";

export const renderFieldPreview = (field: Field) => {
  switch (field.type) {
    case FieldsType.TEXT:
    case FieldsType.EMAIL:
    case FieldsType.NUMBER:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400">
          {field.placeholder || `Enter ${field.type}...`}
        </div>
      );
    case FieldsType.TEXT_AREA:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 min-h-[100px]">
          {field.placeholder || "Enter text..."}
        </div>
      );
    case FieldsType.CHECKBOX:
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded bg-gray-50" />
          <span className="text-gray-600">{field.label}</span>
        </div>
      );
    case FieldsType.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option} className="flex items-center gap-2">
              <div className="w-4 h-4 border rounded-full bg-gray-50" />
              <span className="text-gray-600">{option}</span>
            </div>
          ))}
        </div>
      );
    case FieldsType.SELECT:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 flex justify-between items-center">
          <span>{field.placeholder || "Select an option..."}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      );
    case FieldsType.DATE:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 flex justify-between items-center">
          <span>{field.placeholder || "Select date..."}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400">
          {field.placeholder || "Input field"}
        </div>
      );
  }
};