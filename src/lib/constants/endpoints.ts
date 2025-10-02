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
  PLATFORM_INVITE: "/api/v1/auth/platform_invite",
};

export const USER_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/users",
  GET_ID: "/api/v1/admin/users/:id",
  CREATE: "/api/v1/admin/users",
  ADMIN_UPDATE: "/api/v1/admin/users/:id",
  DELETE: "/api/v1/admin/users/:id",
};

export const FORM_ENDPOINTS = {
  GET_ALL: "/api/v1/admin/forms",
  GET_ID: "/api/v1/admin/forms/:id",
  CREATE: "/api/v1/admin/forms",
  UPDATE: "/api/v1/admin/forms/:id",
  DELETE: "/api/v1/admin/forms/:id",
  GET_ANALYTICS: "/api/v1/admin/analytics/forms/:slug",
};

export const FORM_SUBMISSION_ENDPOINTS = {
  GET_ALL_BY_FORM: "/api/v1/form/form-submissions/:slug",
};
