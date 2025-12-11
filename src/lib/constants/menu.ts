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
  ShieldCheck,
} from "lucide-react";

export type MenuItem = {
  key: string;
  name: string;
  link: string;
  icon: any;
  permission?: string; // Permission key required to view this menu item
};

export type MenuSection = {
  title: string;
  data: MenuItem[];
};

export const NAVIGATION: MenuSection[] = [
  {
    title: "General",
    data: [
      {
        key: "dashboard",
        name: "Dashboard",
        link: URLs.admin.dashboard,
        icon: ChartPie,
        // No permission required - everyone can see dashboard
      },
      {
        key: "users",
        name: "Users",
        link: URLs.admin.users,
        icon: UsersRound,
        permission: "users.view",
      },
      {
        key: "roles",
        name: "Roles & Permissions",
        link: URLs.admin.roles,
        icon: ShieldCheck,
        permission: "roles.view",
      },
      {
        key: "forms",
        name: "Forms",
        link: URLs.admin.forms.index,
        icon: LibraryBigIcon,
        permission: "forms.view",
      },
      {
        key: "actions",
        name: "Actions",
        link: URLs.admin.actions.index,
        icon: ZapIcon,
        // TODO: Add permission when actions module has permissions defined
      },
      {
        key: "workflows",
        name: "Workflows History",
        link: URLs.admin.workflow.index,
        icon: WorkflowIcon,
        permission: "workflows.view",
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
        permission: "organization.view_departments",
      },
      {
        key: "positions",
        name: "Positions",
        link: URLs.admin.positions.index,
        icon: BriefcaseIcon,
        permission: "positions.view",
      },
      {
        key: "branches",
        name: "Branches",
        link: URLs.admin.branches.index,
        icon: MapPinIcon,
        permission: "organization.view_branches",
      },
    ],
  },
  {
    title: "general",
    data: [
      {
        key: "forms",
        name: "Forms",
        link: URLs.app.forms.index,
        icon: LibraryBigIcon,
        permission: "forms.submit",
      },
      {
        key: "submissions",
        name: "Submissions",
        link: URLs.app.submissions.index,
        icon: BookCheckIcon,
        permission: "forms.view_submissions",
      },
    ],
  },
];

export const USER_NAVIGATION: MenuSection[] = [
  {
    title: "general",
    data: [
      {
        key: "forms",
        name: "Forms",
        link: URLs.app.forms.index,
        icon: LibraryBigIcon,
        permission: "forms.submit",
      },
      {
        key: "submissions",
        name: "Submissions",
        link: URLs.app.submissions.index,
        icon: BookCheckIcon,
        permission: "forms.view_submissions",
      },
    ],
  },
];
