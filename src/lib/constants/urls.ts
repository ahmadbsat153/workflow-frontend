import { success } from "zod";

export const URLs = {
  home: "/",
  admin: {
    dashboard: "/admin/dashboard/",
    users: {
      index: "/admin/users/",
      detail: "/admin/users/:slug",
      create: "/admin/users/create/",
      edit: "/admin/users/edit/:id",
    },
    roles: {
      index: "/admin/roles/",
      detail: "/admin/roles/:slug",
      create: "/admin/roles/create/",
      edit: "/admin/roles/edit/:id",
    },
    forms: {
      index: "/admin/forms/",
      detail: "/admin/forms/:slug",
      create: "/admin/forms/create/",
      edit: "/admin/forms/edit/:id",
    },
    submissions: {
      view: "/admin/submissions/view/:id",
    },
    actions: {
      index: "/admin/actions/",
      create: "/admin/actions/create/",
      details: "/admin/actions/view/:action_id",
      edit: "/admin/actions/edit/:action_id",
    },
    workflow: {
      index: "/admin/workflows_history/",
    },
    departments: {
      index: "/admin/departments/",
      create: "/admin/departments/create/",
      edit: "/admin/departments/edit/:id",
    },
    positions: {
      index: "/admin/positions/",
      create: "/admin/positions/create/",
      edit: "/admin/positions/edit/:id",
    },
    branches: {
      index: "/admin/branches/",
      create: "/admin/branches/create/",
      edit: "/admin/branches/edit/:id",
    },
    organization: {
      dashboard: "/admin/organization/dashboard/",
    },
    approvals: {
      index: "/admin/approvals/",
      details: "/admin/approvals/:submissionId",
      success: "/approval/success",
    },
  },
  app: {
    dashboard: "/dashboard/",
    forms: {
      index: "/forms/",
    },
    submissions: {
      index: "/submissions/",
      submit: "/submissions/submit/:form_slug",
      view: "/submissions/view/:id",
    },
    notifications: {
      index: "/notifications",
      preferences: "/notifications/preferences",
    },
  },
  auth: {
    register: "/register/",
    login: "/login",
    forgotPassword: "/password/forgot/",
    resetPassword: "/password/reset/",
    confirmation: "/phone-confirmation/",
    invite: "/invitation/",
    waitlist: "/waitlist/",
  },
  user: {
    create: "/admin/user/create/",
  },
};

export function getUrl(
  path: string,
  lang?: string,
  props?: Record<string, string> | undefined
) {
  let result = String(path);

  if (props) {
    for (const prop in props) {
      result = result.replace(new RegExp(`\\{${prop}\\}`, 'g'), props[prop]);
    }
  }
  if (lang) {
    result = `/${lang}/${result}`;
  }

  return result.replace(/\/+/g, "/"); // just in case anyone formats Urls in a wrong way.
}
