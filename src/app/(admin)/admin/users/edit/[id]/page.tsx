import UserForm from "@/lib/components/Pages/Users/UserForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedPage permission={PERMISSIONS.USERS.EDIT}>
      <UserForm
        userId={id}
        title="Edit User"
        description="Update user details and settings"
      />
    </ProtectedPage>
  );
};

export default page;
