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