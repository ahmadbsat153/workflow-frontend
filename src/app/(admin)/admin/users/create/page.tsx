import { PERMISSIONS } from "@/lib/constants/permissions";
import UserForm from "@/lib/components/Pages/Users/UserForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.USERS.CREATE}>
      <UserForm
        title="Create New User"
        description="Use this form to onboard a new team member by providing their essential details."
      />
    </ProtectedPage>
  );
};

export default page;
