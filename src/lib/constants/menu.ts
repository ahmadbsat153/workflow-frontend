import { URLs } from "./urls";
import {
  BookCheckIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartPie,
  LibraryBigIcon,
  MapPinIcon,
  UsersRound,
  ZapIcon,
  WorkflowIcon,
  Network,
} from "lucide-react";
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
      {
        key: "workflows",
        name: "Workflows History",
        link: URLs.admin.workflow.index,
        icon: WorkflowIcon,
      },
    ],
  },
  {
    title: "Organization",
    data: [
      {
        key: "departments",
        name: "Departments",
        link: URLs.admin.departments.index,
        icon: BuildingIcon,
      },
      {
        key: "positions",
        name: "Positions",
        link: URLs.admin.positions.index,
        icon: BriefcaseIcon,
      },
      {
        key: "branches",
        name: "Branches",
        link: URLs.admin.branches.index,
        icon: MapPinIcon,
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
