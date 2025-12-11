import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import FormBuilder from "@/lib/components/Pages/Forms/CreateForm/FormBuilder";
import { PERMISSIONS } from "@/lib/constants/permissions";

const Page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.FORMS.CREATE}>
      <div className="h-full bg-gray-50 px-2">
        <FormBuilder />
      </div>
    </ProtectedPage>
  );
};
export default Page;
