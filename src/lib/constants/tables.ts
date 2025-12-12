export const USER_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "firstname", sortable: true },
  { name: "email", uid: "email", sortable: true },
  { name: "role", uid: "role", sortable: true },
  { name: "department", uid: "department", sortable: false },
  { name: "position", uid: "position", sortable: false },
  { name: "branch", uid: "branch", sortable: false },
  { name: "status", uid: "is_active", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const USER_VISIBLE_COL = [
  "firstname",
  "email",
  "role",
  "department",
  "position",
  "branch",
  "is_active",
  "createdAt",
  "updatedAt",
  "actions",
];

export const USER_ACTIVITY_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Status", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
];

export const USER_ACTIVITY_VISIBLE_COL = [
  "createdAt",
  "type",
  "isActive",
  "createdAt",
  "updatedAt",
];

export const FORM_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "name", sortable: true },
  { name: "description", uid: "description", sortable: true },
  { name: "status", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const FORM_VISIBLE_COL = [
  "name",
  "isActive",
  "description",
  "createdAt",
  "updatedAt",
  "actions",
  "email",
];

export const FORM_SUBMISSION_COL = [
  { name: "id", uid: "_id", sortable: true },
  { name: "submitted by", uid: "submittedBy", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
];

export const FORM_SUBMISSION_VISIBLE_COL = [
  "submittedBy",
  "createdAt",
  "updatedAt",
];

export const ACTION_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "Action Name", uid: "actionName", sortable: true },
  { name: "Display Name", uid: "displayName", sortable: true },
  { name: "Action Description", uid: "actionDescription", sortable: true },
  { name: "Category", uid: "category", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const ACTION_VISIBLE_COL = [
  "actionName",
  "actionDescription",
  "displayName",
  "category",
  "createdAt",
  "updatedAt",
  "actions",
];

export const WORKFLOW_HISTORY_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "Form name", uid: "form", sortable: true },
  { name: "Submitted By", uid: "submittedBy", sortable: true },
  { name: "status", uid: "workflowStatus", sortable: true },
  { name: "workflowCompletedAt", uid: "workflowCompletedAt", sortable: true },
  { name: "Execution Duration", uid: "executionDuration" },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
];

export const WORKFLOW_HISTORY_VISIBLE_COL = [
  "form",
  "submittedBy",
  "workflowStatus",
  "workflowCompletedAt",
  "executionDuration",
  "createdAt",
  "updatedAt",
];

export const DEPARTMENT_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "name", sortable: true },
  { name: "code", uid: "code", sortable: true },
  { name: "description", uid: "description", sortable: false },
  { name: "parent", uid: "parent", sortable: false },
  { name: "status", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const DEPARTMENT_VISIBLE_COL = [
  "name",
  "code",
  "description",
  "parent",
  "isActive",
  "createdAt",
  "updatedAt",
  "actions",
];

export const POSITION_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "name", sortable: true },
  { name: "code", uid: "code", sortable: true },
  { name: "department", uid: "department", sortable: false },
  { name: "level", uid: "level", sortable: true },
  { name: "status", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const POSITION_VISIBLE_COL = [
  "name",
  "code",
  "department",
  "level",
  "isActive",
  "createdAt",
  "updatedAt",
  "actions",
];

export const BRANCH_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "name", sortable: true },
  { name: "code", uid: "code", sortable: true },
  { name: "department", uid: "department", sortable: false },
  { name: "city", uid: "city", sortable: true },
  { name: "country", uid: "country", sortable: true },
  { name: "phone", uid: "phone", sortable: false },
  { name: "email", uid: "email", sortable: false },
  { name: "status", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const BRANCH_VISIBLE_COL = [
  "name",
  "code",
  "department",
  "city",
  "country",
  "phone",
  "email",
  "isActive",
  "createdAt",
  "updatedAt",
  "actions",
];

export const ROLE_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "name", sortable: true },
  { name: "Code", uid: "code", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "System Role", uid: "isSystemRole", sortable: false },
  { name: "Active", uid: "isActive", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];
export const ROLE_VISIBLE_COL = [
  "name",
  "code",
  "description",
  "isSystemRole",
  "isActive",
  "createdAt",
  "updatedAt",
  "actions",
];

export const AD_USERS_COLUMNS = [
  { name: "Name", uid: "displayName", sortable: true },
  { name: "Email", uid: "mail", sortable: true },
  { name: "Job Title", uid: "jobTitle", sortable: true },
  { name: "actions", uid: "actions" },
];
