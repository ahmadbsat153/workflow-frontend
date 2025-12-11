export const URLs = {
  home: "/",
  admin: {
    dashboard: "/admin/dashboard/",
    users: "/admin/users/",
    roles: "/admin/roles/",
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
  },
  app: {
    forms: {
      index: "/forms/",
    },
    submissions: {
      index: "/submissions/",
      submit: "/submissions/submit/:form_slug",
      view: "/submissions/view/:id",
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
  if (props) {
    for (const prop in props) {
      path = path.replaceAll(`{${prop}}`, props[prop]);
    }
  }
  if (lang) {
    path = `/${lang}/${path}`;
  }

  return path.replaceAll("//", "/"); // just in case anyone formats Urls in a wrong way.
}
