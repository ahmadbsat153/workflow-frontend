import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionDetails } from "@/lib/components/Pages/Actions/ActionDetails";
import { PERMISSIONS } from "@/lib/constants/permissions";
const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.VIEW}>
    <PageContainer>
      <HeaderContainer title="Action Details" />
      <ActionDetails />
    </PageContainer>
    </ProtectedPage>
  );
};

export default page;
