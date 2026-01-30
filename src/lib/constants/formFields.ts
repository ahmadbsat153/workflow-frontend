import {
  FieldsType,
  Field,
  SubmitterInfoProperty,
  CountryCode,
  DateFormat,
  DateConstraint,
} from "@/lib/types/form/fields";
import type { EditableTableConfig } from "@/lib/types/form/editableTable";
import {
  CalendarIcon,
  CheckSquareIcon,
  CircleDotIcon,
  HashIcon,
  ListIcon,
  MailIcon,
  TextIcon,
  TypeIcon,
  MinusIcon,
  Heading1Icon,
  FileTextIcon,
  SpaceIcon,
  ImageIcon,
  AlertCircleIcon,
  CodeIcon,
  ToggleRightIcon,
  UploadIcon,
  BuildingIcon,
  BriefcaseIcon,
  MapPinIcon,
  TableIcon,
  UserIcon,
  PhoneIcon,
} from "lucide-react";

// Helper functions to categorize field types
export const isDisplayElement = (type: FieldsType): boolean => {
  return [
    FieldsType.SEPARATOR,
    FieldsType.TITLE,
    FieldsType.PARAGRAPH,
    FieldsType.SPACER,
    FieldsType.IMAGE,
    FieldsType.ALERT,
    FieldsType.HTML,
  ].includes(type);
};

export const isInputField = (type: FieldsType): boolean => {
  return [
    FieldsType.TEXT,
    FieldsType.NUMBER,
    FieldsType.EMAIL,
    FieldsType.DATE,
    FieldsType.PHONE,
    FieldsType.SELECT,
    FieldsType.RADIO,
    FieldsType.CHECKBOX,
    FieldsType.TEXT_AREA,
    FieldsType.SWITCH,
    FieldsType.FILE,
    FieldsType.DEPARTMENT,
    FieldsType.POSITION,
    FieldsType.BRANCH,
    FieldsType.SUBMITTER_INFO,
    FieldsType.TABLE,
  ].includes(type);
};

// Default values of fields
export const fieldConfigs: Record<FieldsType, Partial<Field>> = {
  // Input Fields
  [FieldsType.TEXT]: {
    label: "Text Input",
    placeholder: "Enter text...",
    required: false,
    defaultValue: "",
    options: undefined,
    validation: {
      minLength: 1,
      maxLength: 100,
    },
  },
  [FieldsType.NUMBER]: {
    label: "Number Input",
    placeholder: "Enter number...",
    required: false,
    defaultValue: 0,
    validation: {
      min: 0,
      max: 999,
    },
  },
  [FieldsType.TEXT_AREA]: {
    label: "Text Area",
    placeholder: "Enter long text...",
    required: false,
    defaultValue: "",
    validation: {
      minLength: 10,
      maxLength: 500,
    },
  },
  [FieldsType.SELECT]: {
    label: "Select Option",
    placeholder: "Choose an option...",
    required: false,
    defaultValue: "",
    options: [],
    validation: {},
  },
  [FieldsType.RADIO]: {
    label: "Radio Buttons",
    placeholder: undefined,
    required: false,
    defaultValue: "",
    options: [],
    validation: {},
  },
  [FieldsType.CHECKBOX]: {
    label: "Checkbox",
    placeholder: undefined,
    required: false,
    defaultValue: "",
    validation: {},
  },
  [FieldsType.DATE]: {
    label: "Date Picker",
    placeholder: "Select date...",
    required: false,
    defaultValue: "",
    validation: {
      dateConstraint: "any" as DateConstraint,
    },
    dateSettings: {
      format: "YYYY-MM-DD" as DateFormat,
    },
  },
  [FieldsType.PHONE]: {
    label: "Phone Number",
    placeholder: "Enter phone number...",
    required: false,
    defaultValue: "",
    validation: {},
    phoneSettings: {
      country: "AU" as CountryCode,
      allowAnyCountry: true,
    },
  },
  [FieldsType.EMAIL]: {
    label: "Email Address",
    placeholder: "email@example.com",
    required: false,
    defaultValue: "",
    validation: {
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
      minLength: 5,
      maxLength: 100,
    },
  },
  [FieldsType.SWITCH]: {
    label: "Toggle Switch",
    required: false,
    defaultValue: false,
    validation: {},
  },
  [FieldsType.FILE]: {
    label: "File Upload",
    placeholder: "Choose file(s)...",
    required: false,
    defaultValue: "",
    validation: {
      minFiles: 1,
      maxFiles: 5,
      allowedFileTypes: [],
      maxFileSize: 5242880,
    },
  },

  // Organizational Fields
  [FieldsType.DEPARTMENT]: {
    label: "Department",
    placeholder: "Select department...",
    required: false,
    defaultValue: "",
    options: undefined,
    validation: {},
  },
  [FieldsType.POSITION]: {
    label: "Position",
    placeholder: "Select position...",
    required: false,
    defaultValue: "",
    options: undefined,
    validation: {},
  },
  [FieldsType.BRANCH]: {
    label: "Branch",
    placeholder: "Select branch...",
    required: false,
    defaultValue: "",
    options: undefined,
    validation: {},
  },
  [FieldsType.SUBMITTER_INFO]: {
    label: "Submitter Info",
    placeholder: "",
    required: false,
    defaultValue: "",
    validation: {},
    submitterInfoConfig: {
      property: "fullName" as SubmitterInfoProperty,
    },
  },
  [FieldsType.TABLE]: {
    label: "Editable Table",
    required: false,
    defaultValue: undefined,
    tableConfig: {
      columns: [
        {
          columnId: "col_1",
          header: "Column 1",
          width: "50%",
          dataType: "text" as const,
          editable: true,
        },
        {
          columnId: "col_2",
          header: "Column 2",
          width: "50%",
          dataType: "text" as const,
          editable: true,
        },
      ],
      rows: [
        {
          rowId: "row_1",
          cells: [
            { value: "", editable: true, dataType: "text" as const },
            { value: "", editable: true, dataType: "text" as const },
          ],
        },
      ],
      settings: {
        showBorders: true,
        allowAddRows: false,
        allowDeleteRows: false,
      },
      tableStyle: {
        width: "100%",
      },
    } as EditableTableConfig,
  },

  // Display Elements
  [FieldsType.SEPARATOR]: {
    label: undefined,
    content: {
      text: undefined,
    },
    style: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#e5e7eb",
      margin: "20px 0",
    },
  },
  [FieldsType.TITLE]: {
    label: undefined,
    content: {
      text: "Section Title",
      level: 2,
    },
    style: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#1f2937",
      alignment: "left",
      margin: "0 0 10px 0",
    },
  },
  [FieldsType.PARAGRAPH]: {
    label: undefined,
    content: {
      text: "Add your description text here. This paragraph will help users understand what information is needed in this section.",
    },
    style: {
      fontSize: "1rem",
      color: "#6b7280",
      alignment: "left",
      margin: "0 0 15px 0",
    },
  },
  [FieldsType.SPACER]: {
    label: undefined,
    content: {
      height: 30,
    },
    style: {},
  },
  [FieldsType.IMAGE]: {
    label: undefined,
    content: {
      imageUrl: "https://via.placeholder.com/600x300",
      imageAlt: "Placeholder image",
    },
    style: {
      alignment: "center",
      margin: "20px 0",
    },
  },
  [FieldsType.ALERT]: {
    label: undefined,
    content: {
      text: "This is an important informational message for your users.",
      alertType: "info",
    },
    style: {
      margin: "10px 0",
    },
  },
  [FieldsType.HTML]: {
    label: undefined,
    content: {
      html: "<p>Add your custom <strong>HTML</strong> content here.</p>",
    },
    style: {
      margin: "10px 0",
    },
  },
};

// Helper function to get all field types
export const getAllFieldTypes = () => Object.values(FieldsType);

// Helper to get only input field types
export const getInputFieldTypes = () =>
  Object.values(FieldsType).filter(isInputField);

// Helper to get only display element types
export const getDisplayElementTypes = () =>
  Object.values(FieldsType).filter(isDisplayElement);

// Helper to create a field from config
export const createFieldFromType = (
  type: FieldsType,
  overrides?: Partial<Field>,
): Field => {
  const config = fieldConfigs[type];

  // Base field structure
  const baseField: Partial<Field> = {
    name: overrides?.name || `${type}_${Date.now()}`,
    type: type,
    ...overrides,
  };

  // Display elements don't need label, placeholder, required, defaultValue, options, validation
  if (isDisplayElement(type)) {
    return {
      ...baseField,
      content: config.content,
      style: {
        ...config.style,
        ...overrides?.style,
      },
    } as Field;
  }

  // Input fields structure
  return {
    ...baseField,
    label: config.label || type,
    required: config.required ?? false,
    placeholder: config.placeholder,
    defaultValue: config.defaultValue,
    options: config.options,
    validation: config.validation || {},
    tableConfig: config.tableConfig,
    submitterInfoConfig: config.submitterInfoConfig,
    dateSettings: config.dateSettings,
    phoneSettings: config.phoneSettings,
  } as Field;
};

export const getFieldTypeIcon = (type: FieldsType) => {
  switch (type) {
    // Input Fields
    case FieldsType.TEXT:
      return TypeIcon;
    case FieldsType.NUMBER:
      return HashIcon;
    case FieldsType.TEXT_AREA:
      return TextIcon;
    case FieldsType.SELECT:
      return ListIcon;
    case FieldsType.CHECKBOX:
      return CheckSquareIcon;
    case FieldsType.RADIO:
      return CircleDotIcon;
    case FieldsType.DATE:
      return CalendarIcon;
    case FieldsType.PHONE:
      return PhoneIcon;
    case FieldsType.EMAIL:
      return MailIcon;
    case FieldsType.SWITCH:
      return ToggleRightIcon;
    case FieldsType.FILE:
      return UploadIcon;
    // Organizational Fields
    case FieldsType.DEPARTMENT:
      return BuildingIcon;
    case FieldsType.POSITION:
      return BriefcaseIcon;
    case FieldsType.BRANCH:
      return MapPinIcon;
    case FieldsType.SUBMITTER_INFO:
      return UserIcon;
    case FieldsType.TABLE:
      return TableIcon;
    // Display Elements
    case FieldsType.SEPARATOR:
      return MinusIcon;
    case FieldsType.TITLE:
      return Heading1Icon;
    case FieldsType.PARAGRAPH:
      return FileTextIcon;
    case FieldsType.SPACER:
      return SpaceIcon;
    case FieldsType.IMAGE:
      return ImageIcon;
    case FieldsType.ALERT:
      return AlertCircleIcon;
    case FieldsType.HTML:
      return CodeIcon;

    default:
      return TypeIcon;
  }
};

// Helper to get field type label for display
export const getFieldTypeLabel = (type: FieldsType): string => {
  const labels: Record<FieldsType, string> = {
    // Input Fields
    [FieldsType.TEXT]: "Text",
    [FieldsType.NUMBER]: "Number",
    [FieldsType.EMAIL]: "Email",
    [FieldsType.DATE]: "Date",
    [FieldsType.PHONE]: "Phone",
    [FieldsType.SELECT]: "Select",
    [FieldsType.RADIO]: "Radio",
    [FieldsType.CHECKBOX]: "Checkbox",
    [FieldsType.TEXT_AREA]: "Textarea",
    [FieldsType.SWITCH]: "Switch",
    [FieldsType.FILE]: "File",

    // Organizational Fields
    [FieldsType.DEPARTMENT]: "Department",
    [FieldsType.POSITION]: "Position",
    [FieldsType.BRANCH]: "Branch",
    [FieldsType.SUBMITTER_INFO]: "Submitter Info",
    [FieldsType.TABLE]: "Table",

    // Display Elements
    [FieldsType.SEPARATOR]: "Separator",
    [FieldsType.TITLE]: "Title",
    [FieldsType.PARAGRAPH]: "Paragraph",
    [FieldsType.SPACER]: "Spacer",
    [FieldsType.IMAGE]: "Image",
    [FieldsType.ALERT]: "Alert",
    [FieldsType.HTML]: "HTML",
  };

  return labels[type] || type;
};

// Submitter Info property options for dropdown
export const submitterInfoPropertyOptions: {
  value: SubmitterInfoProperty;
  label: string;
}[] = [
  { value: "firstname", label: "First Name" },
  { value: "lastname", label: "Last Name" },
  { value: "fullName", label: "Full Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "payrollNo", label: "Payroll Number" },
  { value: "businessUnit", label: "Business Unit" },
  { value: "businessUnitAddress", label: "Business Unit Address" },
  { value: "paymentMethod", label: "Payment Method" },
  { value: "department", label: "Department" },
  { value: "position", label: "Position" },
  { value: "branch", label: "Branch" },
  { value: "manager", label: "Manager" },
];

// Get label for submitter info property
export const getSubmitterInfoPropertyLabel = (
  property: SubmitterInfoProperty,
): string => {
  return (
    submitterInfoPropertyOptions.find((opt) => opt.value === property)?.label ||
    property
  );
};

// Date format options for dropdown
export const dateFormatOptions: { value: DateFormat; label: string }[] = [
  { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
];

// Country code options for phone field
export const countryCodeOptions: {
  group: string;
  countries: { value: string; label: string; dialCode: string }[];
}[] = [
  {
    group: "Most Common",
    countries: [
      { value: "AU", label: "Australia", dialCode: "+61" },
      { value: "LB", label: "Lebanon", dialCode: "+961" },
    ],
  },
  {
    group: "Asia",
    countries: [
      // Asia
      { value: "IN", label: "India", dialCode: "+91" },
      { value: "PK", label: "Pakistan", dialCode: "+92" },
      { value: "BD", label: "Bangladesh", dialCode: "+880" },
      { value: "CN", label: "China", dialCode: "+86" },
      { value: "JP", label: "Japan", dialCode: "+81" },
      { value: "KR", label: "South Korea", dialCode: "+82" },
      { value: "TH", label: "Thailand", dialCode: "+66" },
      { value: "VN", label: "Vietnam", dialCode: "+84" },
      { value: "MY", label: "Malaysia", dialCode: "+60" },
      { value: "SG", label: "Singapore", dialCode: "+65" },
      { value: "PH", label: "Philippines", dialCode: "+63" },
      { value: "ID", label: "Indonesia", dialCode: "+62" },
    ],
  },
  {
    group: "Americas",
    countries: [
      { value: "US", label: "United States", dialCode: "+1" },
      { value: "CA", label: "Canada", dialCode: "+1" },
      { value: "MX", label: "Mexico", dialCode: "+52" },
      { value: "BR", label: "Brazil", dialCode: "+55" },
      { value: "AR", label: "Argentina", dialCode: "+54" },
      { value: "CL", label: "Chile", dialCode: "+56" },
      { value: "CO", label: "Colombia", dialCode: "+57" },
    ],
  },
  {
    group: "Europe",
    countries: [
      // Europe
      { value: "GB", label: "United Kingdom", dialCode: "+44" },
      { value: "DE", label: "Germany", dialCode: "+49" },
      { value: "FR", label: "France", dialCode: "+33" },
      { value: "IT", label: "Italy", dialCode: "+39" },
      { value: "ES", label: "Spain", dialCode: "+34" },
      { value: "NL", label: "Netherlands", dialCode: "+31" },
      { value: "BE", label: "Belgium", dialCode: "+32" },
      { value: "CH", label: "Switzerland", dialCode: "+41" },
      { value: "AT", label: "Austria", dialCode: "+43" },
      { value: "SE", label: "Sweden", dialCode: "+46" },
      { value: "NO", label: "Norway", dialCode: "+47" },
      { value: "DK", label: "Denmark", dialCode: "+45" },
      { value: "FI", label: "Finland", dialCode: "+358" },
      { value: "PL", label: "Poland", dialCode: "+48" },
      { value: "CZ", label: "Czech Republic", dialCode: "+420" },
      { value: "PT", label: "Portugal", dialCode: "+351" },
      { value: "GR", label: "Greece", dialCode: "+30" },
      { value: "TR", label: "Turkey", dialCode: "+90" },
      { value: "RU", label: "Russia", dialCode: "+7" },
      { value: "UA", label: "Ukraine", dialCode: "+380" },
    ],
  },
  {
    group: "Africa",
    countries: [
      // Africa
      { value: "ZA", label: "South Africa", dialCode: "+27" },
      { value: "NG", label: "Nigeria", dialCode: "+234" },
      { value: "KE", label: "Kenya", dialCode: "+254" },
      { value: "GH", label: "Ghana", dialCode: "+233" },
      // North Africa
      { value: "LY", label: "Libya", dialCode: "+218" },
      { value: "TN", label: "Tunisia", dialCode: "+216" },
      { value: "DZ", label: "Algeria", dialCode: "+213" },
      { value: "MA", label: "Morocco", dialCode: "+212" },
      { value: "SD", label: "Sudan", dialCode: "+249" },
    ],
  },
  {
    group: "Middle East",
    countries: [
      // Middle East
      { value: "AE", label: "United Arab Emirates", dialCode: "+971" },
      { value: "SA", label: "Saudi Arabia", dialCode: "+966" },
      { value: "EG", label: "Egypt", dialCode: "+20" },
      { value: "JO", label: "Jordan", dialCode: "+962" },
      { value: "KW", label: "Kuwait", dialCode: "+965" },
      { value: "QA", label: "Qatar", dialCode: "+974" },
      { value: "BH", label: "Bahrain", dialCode: "+973" },
      { value: "OM", label: "Oman", dialCode: "+968" },
      { value: "SY", label: "Syria", dialCode: "+963" },
      { value: "IQ", label: "Iraq", dialCode: "+964" },
      { value: "PS", label: "Palestine", dialCode: "+970" },
      { value: "YE", label: "Yemen", dialCode: "+967" },
    ],
  },
  {
    group: "Oceania",
    countries: [
      // Oceania
      { value: "NZ", label: "New Zealand", dialCode: "+64" },
    ],
  },
];
