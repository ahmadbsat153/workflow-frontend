import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import FormAnalytics from "@/lib/components/Pages/Forms/FormAnalytics";
import FormsSubmissionsTable from "@/lib/components/Pages/Forms/FormSubmissions";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.FORMS.VIEW_SUBMISSIONS}>
      <PageContainer>
        <FormAnalytics />
        <FormsSubmissionsTable />
      </PageContainer>
    </ProtectedPage>
  );
};
export default page;
