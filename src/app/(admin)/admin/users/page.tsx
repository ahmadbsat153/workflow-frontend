import Link from "next/link";
import { Button } from "@/lib/ui/button";
import { getUrl, URLs } from "@/lib/constants/urls";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import UsersTable from "@/lib/components/Pages/Users/UsersTable";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Users"
        description="Manage platform users from here"
      >
        <Button asChild color="primary" variant="default">
          <Link href={getUrl(URLs.admin.users)}>Add</Link>
        </Button>
      </HeaderContainer>

      <UsersTable />
    </PageContainer>
  );
};
export default page;
