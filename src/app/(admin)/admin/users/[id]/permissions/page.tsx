import UserPermissionsManager from "@/lib/components/Pages/Users/UserPermissionsManager";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedPage permission={PERMISSIONS.USERS.MANAGE_PERMISSIONS}>
      <PageContainer>
        <HeaderContainer
          title="Manage User Permissions"
          description="Grant or deny specific permissions for this user"
        />
        <UserPermissionsManager userId={id} />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
