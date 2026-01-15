import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/ui/alert-dialog";
import { DataTable } from "../../Table/DataTable";
import { AD_USERS_COLUMNS } from "@/lib/constants/tables";
import { useCallback, useEffect, useState } from "react";
import { API_USER } from "@/lib/services/User/user_service";
import { ADUser, ADUserTable } from "@/lib/types/user/user";
import { INITIAL_META } from "@/lib/constants/initials";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { toast } from "sonner";
import { CellRenderer } from "@/lib/types/table/table_data";
import { Button } from "@/lib/ui/button";
import { UserPlus2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { URLs } from "@/lib/constants/urls";

type UserFromADModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const UserFromADModal = ({
  children,
  title,
  description,
}: UserFromADModalProps) => {
  const router = useRouter();
  const [adUsers, setADUsers] = useState<ADUserTable>({
    data: [],
    meta: INITIAL_META,
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    search: "",
    sortField: "createdAt",
    sortOrder: "asc" as "asc" | "desc",
  });

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", query.page.toString());
      params.append("limit", query.limit.toString());
      if (query.search) params.append("search", query.search);
      params.append("sortField", query.sortField);
      params.append("sortOrder", query.sortOrder);

      const res = await API_USER.getActiveADUsers(`?${params.toString()}`);
      setADUsers(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // Only fetch when modal is open
    if (isOpen) {
      getUsers();
    }
  }, [
    isOpen,
    query.page,
    query.limit,
    query.search,
    query.sortField,
    query.sortOrder,
    getUsers,
  ]);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setQuery((prev) => ({ ...prev, limit: size, page: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search: search || "", page: 1 }));
  }, []);

  const handleSort = useCallback((field: string, order: "asc" | "desc") => {
    setQuery((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: order,
      page: 1,
    }));
  }, []);

  const handleAddUserFromAD = (adUser: ADUser) => {
    // Encode the AD user data to pass it via URL
    const encodedData = encodeURIComponent(JSON.stringify(adUser));
    router.push(URLs.admin.users.create + `?adUser=${encodedData}`);
    setIsOpen(false);
  };

  const cellRenderers: Partial<Record<string, CellRenderer<ADUser>>> = {
    actions: (value, row) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAddUserFromAD(row)}
          title="Add User"
        >
          <UserPlus2Icon className="size-4 text-primary" />
        </Button>
      </div>
    ),
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="!max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <DataTable
          loading={loading}
          data={adUsers.data}
          meta={adUsers?.meta}
          columns={AD_USERS_COLUMNS}
          onSort={handleSort}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          cellRenderers={cellRenderers}
          currentSortField={query.sortField}
          currentSortOrder={query.sortOrder}
          className="max-h-96 overflow-y-auto"
          serverSide={true}
          enableSorting={false}
          enableColumnVisibility={false}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserFromADModal;
