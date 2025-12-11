import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.BRANCHES.EDIT}>
      <PageContainer>
        <HeaderContainer
          title="Edit Branch"
          description="Update branch information."
        />
        <BranchForm isEdit />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
