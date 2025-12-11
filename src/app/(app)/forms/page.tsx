import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import FormsPageContent from "@/lib/components/Pages/Forms/FormPageContent";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.FORMS.VIEW}>
      <PageContainer>
        <FormsPageContent />
      </PageContainer>
    </ProtectedPage>
  );
};
export default page;
