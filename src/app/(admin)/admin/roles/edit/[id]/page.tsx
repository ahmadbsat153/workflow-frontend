import RoleForm from "@/lib/components/Pages/Roles/RoleForm";
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
    <ProtectedPage permission={PERMISSIONS.ROLES.CREATE}>
      <PageContainer>
        <HeaderContainer
          title="Edit Role"
          description="Update role details and permissions"
        />
        <RoleForm roleId={id} />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
