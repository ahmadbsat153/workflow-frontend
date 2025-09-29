import PageContainer from "@/lib/components/Container/PageContainer";
import FormAnalytics from "@/lib/components/Pages/Forms/FormAnalytics";
import FormsSubmissionsTable from "@/lib/components/Pages/Forms/FormSubmissions";

const page = () => {
  return (
    <PageContainer>
      <FormAnalytics />
      <FormsSubmissionsTable />
    </PageContainer>
  );
};
export default page;
