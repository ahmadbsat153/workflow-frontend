import { PERMISSIONS } from "@/lib/constants/permissions";
import RoleForm from "@/lib/components/Pages/Roles/RoleForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedPage permission={PERMISSIONS.ROLES.CREATE}>
      <RoleForm
        roleId={id}
        title="Edit Role"
        description="Update role details and permissions"
      />
    </ProtectedPage>
  );
};

export default page;
