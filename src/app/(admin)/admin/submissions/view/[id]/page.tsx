import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import SubmissionDetails from "@/lib/components/Pages/Submissions/SubmissionDetails";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.SUBMISSIONS.VIEW}>
      <PageContainer className="bg-cultured py-2!">
        <SubmissionDetails />
      </PageContainer>
    </ProtectedPage>
  );
};
export default page;
