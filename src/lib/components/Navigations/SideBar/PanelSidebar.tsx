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
import { Separator } from "@/lib/ui/separator";
import { ADMIN_NAVIGATION } from "@/lib/constants/menu";
import PanelSidebarAccount from "./PanelSidebarAccount";
import { BellIcon } from "lucide-react";

export function PanelSidebar({
  children,
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu className="flex w-full items-end gap-2">
            <SidebarTrigger iconClassName="!size-5" />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {ADMIN_NAVIGATION.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarMenu>
                {section.data.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <a href={item.link} className="font-large">
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

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b w-full px-2 xl:px-8 2xl:px-16 mb-2" >
          <BellIcon className="size-5 text-default-500" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
