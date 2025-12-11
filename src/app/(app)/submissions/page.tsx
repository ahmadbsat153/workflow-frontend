import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import SubmissionsUserTable from "@/lib/components/Pages/Submissions/SubmissionsUser";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.SUBMISSIONS.VIEW}> 
      <PageContainer>
        <HeaderContainer title="Submissions" />
        <SubmissionsUserTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
