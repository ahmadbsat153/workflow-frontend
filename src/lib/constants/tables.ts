export const USER_COLUMNS = [
  { name: "id", uid: "_id", sortable: true },
  { name: "name", uid: "firstname", sortable: true },
  { name: "email", uid: "email", sortable: true },
  { name: "status", uid: "is_active", sortable: true },
  { name: "Created", uid: "createdAt", sortable: true },
  { name: "Updated", uid: "updatedAt", sortable: true },
  { name: "actions", uid: "actions" },
];

export const USER_VISIBLE_COL = [
  "firstname",
  "is_active",
  "createdAt",
  "updatedAt",
  "actions",
  "email"
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
  "email"
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