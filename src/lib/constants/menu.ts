import { URLs } from "./urls";
import { ChartPie, LibraryBigIcon, UsersRound } from "lucide-react";
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
    ],
  },
];
