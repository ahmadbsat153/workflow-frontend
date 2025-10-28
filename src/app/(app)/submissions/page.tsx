import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import SubmissionsUserTable from "@/lib/components/Pages/Submissions/SubmissionsUser";

const page = () => {
  return (
    <div>
      <PageContainer>
        <HeaderContainer title="Submissions" />
        <SubmissionsUserTable />
      </PageContainer>
    </div>
  );
};

export default page;
