export const URLs = {
  home: "/",
  admin: {
    dashboard: "/admin/dashboard/",
    users: "/admin/users/",
    forms: {
      index: "/admin/forms/",
      detail: "/admin/forms/:slug",
      create: "/admin/forms/create/",
    },
  },
  auth: {
    register: "/register/",
    login: "/login",
    forgotPassword: "/reset/password/",
    resetPassword: "/reset-password/",
    confirmation: "/phone-confirmation/",
    invite: "/invitation/",
    waitlist: "/waitlist/",
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
