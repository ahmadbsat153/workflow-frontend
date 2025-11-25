import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionDetails } from "@/lib/components/Pages/Actions/ActionDetails";
const page = () => {
  return (
    <PageContainer>
      <HeaderContainer title="Action Details" />
      <ActionDetails />
    </PageContainer>
  );
};

export default page;
