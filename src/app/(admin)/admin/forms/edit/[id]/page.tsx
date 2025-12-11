import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import FormEditContent from "@/lib/components/Pages/Forms/FormEditContent";
import { PERMISSIONS } from "@/lib/constants/permissions";

const Page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.FORMS.EDIT}>
      <PageContainer className="bg-gray-50 !pt-4 !xl:px-0 !px-0">
        <FormEditContent />
      </PageContainer>
    </ProtectedPage>
  );
};
export default Page;
