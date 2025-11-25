import { URLs } from "./urls";
import { BookCheckIcon, ChartPie, LibraryBigIcon, UsersRound, ZapIcon } from "lucide-react";
export const ADMIN_NAVIGATION = [
  {
    title: "General",
    data: [
      {
        key: "dashboard",
        name: "Dashboard",
        link: URLs.admin.dashboard,
        icon: ChartPie,
      },
      {
        key: "users",
        name: "Users",
        link: URLs.admin.users,
        icon: UsersRound,
      },
      {
        key: "forms",
        name: "Forms",
        link: URLs.admin.forms.index,
        icon: LibraryBigIcon,
      },
      {
        key: "actions",
        name: "Actions",
        link: URLs.admin.actions.index,
        icon: ZapIcon,
      },
    ],
  },
];

export const USER_NAVIGATION = [
  {
    title: "general",
    data: [
      {
        key: "forms",
        name: "Forms",
        link: URLs.app.forms.index,
        icon: LibraryBigIcon,
      },
      {
        key: "submissions",
        name: "Submissions",
        link: URLs.app.submissions.index,
        icon: BookCheckIcon,
      },
    ],
  },
];
