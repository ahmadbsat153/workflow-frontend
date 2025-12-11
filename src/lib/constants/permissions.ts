export const PERMISSIONS = {
  WORKFLOWS: {
    VIEW: "workflows.view",
    EDIT: "workflows.edit",
    CREATE: "workflows.create",
    DELETE: "workflows.delete",
    VIEW_ALL_SUBMISSIONS: "workflows.view_all_submissions",
    VIEW_HISTORY: "workflows.view_history",
  },
  FORMS: {
    VIEW: "forms.view",
    CREATE: "forms.create",
    EDIT: "forms.edit",
    DELETE: "forms.delete",
    SUBMIT: "forms.submit",
    VIEW_SUBMISSIONS: "forms.view_submissions",
    EXPORT_SUBMISSIONS: "forms.export_submissions",
  },
  BRANCHES: {
    VIEW: "branches.view",
    CREATE: "branches.create",
    EDIT: "branches.edit",
    DELETE: "branches.delete",
  },
  DEPARTMENTS: {
    VIEW: "departments.view",
    CREATE: "departments.create",
    EDIT: "departments.edit",
    DELETE: "departments.delete",
  },
  POSITIONS: {
    VIEW: "positions.view",
    CREATE: "positions.create",
    EDIT: "positions.edit",
    DELETE: "positions.delete",
  },
  ACTIONS: {
    VIEW: "actions.view",
    CREATE: "actions.create",
    EDIT: "actions.edit",
    DELETE: "actions.delete",
  },
  ROLES: {
    VIEW: "roles.view",
    CREATE: "roles.create",
    EDIT: "roles.edit",
    DELETE: "roles.delete",
  },
  SUBMISSIONS: {
    VIEW: "submissions.view",
  },
  USERS: {
    VIEW: "users.view",
    CREATE: "users.create",
    EDIT: "users.edit",
    DELETE: "users.delete",
    MANAGE_PERMISSIONS: "users.manage_permissions",
  },

  ACTIVE_DIRECTORY: {
    CREATE_USER: "active_directory.create_user",
  }
};
