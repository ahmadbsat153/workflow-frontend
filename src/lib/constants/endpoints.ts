export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  VALIDATE: "/api/v1/auth/validate",
  FORGOT_PASSWORD: "/api/v1/auth/forgot/password",
  RESET_PASSWORD: "/api/v1/auth/reset/password",
  UPDATE_PASSWORD: "/api/v1/auth/change/password",
  VERIFY_PHONE: "/api/v1/auth/verify/phone",
  VERIFY_EMAIL: "/api/v1/auth/verify/email",
  RESEND_EMAIL: "/api/v1/auth/resend/email",
  MAGIC_LINK: "/api/v1/auth/magic-link",
  VALIDATE_RECOVERY_TOKEN: "/api/v1/auth/validate/recovery-token",
  PLATFORM_INVITE: "/api/v1/auth/platform_invite",
};

export const USER_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/users",
  GET_ID: "/api/v1/admin/users/:id",
  GET_ANALYTICS: "/api/v1/admin/users/analytics/:id",
  CREATE: "/api/v1/admin/users",
  ADMIN_UPDATE: "/api/v1/admin/users/:id",
  DELETE: "/api/v1/admin/users/:id",
};

export const WORKFLOW_HISTORY_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/submissions/workflow-monitoring",
};

export const WORKFLOW_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/workflow",
  GET_ID: "/api/v1/admin/workflow/:id",
  CREATE: "/api/v1/admin/workflow/:formId",
  UPDATE: "/api/v1/admin/workflow/:id",
  DELETE: "/api/v1/admin/workflows:id",
  GET_BY_FORM: "/api/v1/admin/workflow/form/:formId",
  GET_ANALYTICS: "/api/v1/admin/workflow/:id/analytics",
};

export const FORM_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/forms",
  GET_ID: "/api/v1/admin/forms/:id",
  CREATE: "/api/v1/admin/forms",
  UPDATE: "/api/v1/admin/forms/:id",
  DELETE: "/api/v1/admin/forms/:id",
  GET_ANALYTICS: "/api/v1/admin/analytics/forms/:slug",
  GET_BY_SLUG: "/api/v1/admin/forms/by-slug/:slug",
  GET_FIELD_TEMPLATE: "/api/v1/admin/forms/:id/template-fields",
};

export const FORM_SUBMISSION_ENDPOINTS = {
  GET_ALL_BY_FORM: "/api/v1/form/form-submissions/:slug",
  GET_ALL_BY_USER: "/api/v1/form/submissions",
  GET_ID: "/api/v1/form/submission/:id",
  SUBMIT_FORM: "/api/v1/form/submission",
};

export const ACTION_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/actions",
  ACTIVE: "/api/v1/admin/actions-active/",
  GET_ID: "/api/v1/admin/actions/:id",
  CREATE: "/api/v1/admin/actions",
  UPDATE: "/api/v1/admin/actions/:id",
  DELETE: "/api/v1/admin/actions/:id",
};

export const DEPARTMENT_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/departments",
  GET_ACTIVE: "/api/v1/admin/departments/active",
  GET_ID: "/api/v1/admin/departments/:id",
  GET_HIERARCHY: "/api/v1/admin/departments/hierarchy",
  CREATE: "/api/v1/admin/departments",
  UPDATE: "/api/v1/admin/departments/:id",
  DELETE: "/api/v1/admin/departments/:id",
};

export const POSITION_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/positions",
  GET_ACTIVE: "/api/v1/admin/positions/active",
  GET_ID: "/api/v1/admin/positions/:id",
  GET_USERS: "/api/v1/admin/positions/:id/users",
  CREATE: "/api/v1/admin/positions",
  UPDATE: "/api/v1/admin/positions/:id",
  DELETE: "/api/v1/admin/positions/:id",
};

export const BRANCH_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/branches",
  GET_ACTIVE: "/api/v1/admin/branches/active",
  GET_ID: "/api/v1/admin/branches/:id",
  GET_USERS: "/api/v1/admin/branches/:id/users",
  CREATE: "/api/v1/admin/branches",
  UPDATE: "/api/v1/admin/branches/:id",
  DELETE: "/api/v1/admin/branches/:id",
};
