"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/lib/ui/sidebar";

import { cn } from "@/lib/utils";
import { isLinkActive } from "@/utils/common";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { usePermissions } from "@/lib/hooks/usePermissions";
import PanelSidebarAccount from "./PanelSidebarAccount";
import { NAVIGATION } from "@/lib/constants/menu";
import { NotificationBell } from "@/lib/components/Navigations/Notifications/NotificationBell";

const HIDDEN_SIDEBAR_ROUTES = ["/admin/forms/create", "/admin/forms/edit"];

export function PanelSidebar({
  children,
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();
  // Filter menu items based on permissions

  const filteredNavigation = NAVIGATION.map((section) => ({
    ...section,
    data: section.data.filter(
      (item) => !item.permission || hasPermission(item.permission)
    ),
  })).filter((section) => section.data.length > 0);

  const shouldHideSidebar = HIDDEN_SIDEBAR_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <SidebarProvider forceCollapsed={shouldHideSidebar}>
      {true && (
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu className="flex w-full items-end gap-2">
              <SidebarTrigger iconClassName="!size-5" />
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {filteredNavigation.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarMenu>
                  {section.data.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.link}
                            className={cn(
                              isLinkActive(item.link, pathname)
                                ? "text-primary bg-primary/10 font-medium"
                                : "text-black",
                              "font-large"
                            )}
                          >
                            <IconComponent className="!size-5" />
                            {item.name}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <PanelSidebarAccount />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      )}

      <SidebarInset className="overflow-hidden">
        <header className="flex h-12 shrink-0 items-center justify-end gap-2 border-b w-full px-2 xl:px-8 2xl:px-16">
          <NotificationBell />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
