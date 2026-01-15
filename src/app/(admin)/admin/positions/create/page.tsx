import PositionForm from "@/lib/components/Pages/Positions/PositionForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.POSITIONS.CREATE}>
      <PositionForm
        title="Create Position"
        description="Add a new position to a department."
      />
    </ProtectedPage>
  );
};

export default page;
