export const URLs = {
  home: "/",
  admin: {
    dashboard: "/admin/dashboard/",
    users: "/admin/users/",
    forms: {
      index: "/admin/forms/",
      detail: "/admin/forms/:slug",
      create: "/admin/forms/create/",
      edit: "/admin/forms/edit/:id",
    },
    submissions: {
      view: "/admin/submissions/view/:id",
    },
  },
  app: {
    forms: {
      index: "/forms/",
    },
    submissions: {
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
  }
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
