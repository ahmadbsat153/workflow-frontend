"use client";
import { useAuth } from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/lib/ui/sidebar";
import {
  Bell,
  UserIcon,
  BadgeCheck,
  ChevronsUpDown,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import PanelSidebarLogout from "./PanelSiderbarLogout";
import { URLs } from "@/lib/constants/urls";

const PanelSidebarAccount = () => {
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-t-2"
            >
              <UserIcon className="!size-6" />
              <div className="grid flex-1 text-left text-sm leading-tight ">
                <span className="truncate font-medium">
                  {user?.user.firstname} {user?.user.lastname}
                </span>
                <span className="truncate text-xs">{user?.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.user.firstname} {user?.user.lastname}
                  </span>
                  <span className="truncate text-xs">{user?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={URLs.app.profile}>
                  <BadgeCheck />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={URLs.app.notifications.preferences}>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={URLs.admin.settings.index}>
                  <Settings2 />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PanelSidebarLogout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default PanelSidebarAccount;
