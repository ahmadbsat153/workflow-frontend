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
  ClipboardCheck,
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
        link: URLs.admin.users.index,
        icon: UsersRound,
        permission: "users.view",
      },
      {
        key: "roles",
        name: "Roles & Permissions",
        link: URLs.admin.roles.index,
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
        key: "submissions",
        name: "Submissions",
        link: URLs.app.submissions.index,
        icon: BookCheckIcon,
        permission: "forms.view_submissions",
      },
      {
        key: "actions",
        name: "Actions",
        link: URLs.admin.actions.index,
        icon: ZapIcon,
        permission: "actions.view",
      },
      {
        key: "workflows",
        name: "Workflows History",
        link: URLs.admin.workflow.index,
        icon: WorkflowIcon,
        permission: "workflows.view_history",
      },
      {
        key: "approvals",
        name: "My Approvals",
        link: URLs.admin.approvals.index,
        icon: ClipboardCheck,
        permission: "approvals.view",
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
        permission: "departments.view",
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
        permission: "branches.view",
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
