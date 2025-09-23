import { PanelSidebar } from "@/lib/components/Navigations/SideBar/PanelSidebar";
import { SidebarProvider } from "@/lib/ui/sidebar";
import AuthGuardProvider from "@/provider-guard";

type Props = {
  children: React.ReactNode;
};

export default async function PanelLayout({ children }: Props) {
  return (
    <>
      <AuthGuardProvider is_admin>
        <PanelSidebar>{children}</PanelSidebar>
      </AuthGuardProvider>
    </>
  );
}
