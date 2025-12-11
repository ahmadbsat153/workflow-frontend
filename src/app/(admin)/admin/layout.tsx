import { PanelSidebar } from "@/lib/components/Navigations/SideBar/PanelSidebar";
import AuthGuardProvider from "@/provider-guard";

type Props = {
  children: React.ReactNode;
};

export default async function PanelLayout({ children }: Props) {
  return (
    <>
      <AuthGuardProvider>
        <PanelSidebar>{children}</PanelSidebar>
      </AuthGuardProvider>
    </>
  );
}
