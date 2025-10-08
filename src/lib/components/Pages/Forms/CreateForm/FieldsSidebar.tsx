
import FieldSidebarItem from "./FieldSidebarItem";
import { getAllFieldTypes } from "@/lib/constants/formFields";

const FieldsSidebar = () => {
  const fieldTypes = getAllFieldTypes();

  return (
    <div className="space-y-5 p-2 min-w-xs">
      {fieldTypes.map((type) => {
        return <FieldSidebarItem key={type} type={type} />;
      })}
    </div>
  );
};

export default FieldsSidebar;
