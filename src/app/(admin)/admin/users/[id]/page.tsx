import PageContainer from "@/lib/components/Container/PageContainer";
import UserDetails from "@/lib/components/Pages/Users/UserDetails";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedPage permission={PERMISSIONS.USERS.VIEW}>
      <UserDetails userId={id} />
    </ProtectedPage>
  );
};

export default page;
