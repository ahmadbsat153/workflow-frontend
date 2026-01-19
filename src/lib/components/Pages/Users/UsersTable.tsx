/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { URLs } from "@/lib/constants/urls";
import { RefreshCwIcon } from "lucide-react";
import UserFromADModal from "./UserFromADModal";
import BulkADSyncModal from "./BulkADSyncModal";
import { DataTable } from "../../Table/DataTable";
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { User, UserTable } from "@/lib/types/user/user";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { API_USER } from "@/lib/services/User/user_service";
import { UserRoundPlusIcon, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { USER_COLUMNS, USER_VISIBLE_COL } from "@/lib/constants/tables";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";

const searchParams = {
  page: parseAsInteger,
  limit: parseAsInteger,
  search: parseAsString,
  sortField: parseAsString,
  sortOrder: parseAsString,
};

const UsersTable = () => {
  const [users, setUsers] = useState<UserTable>({
    data: [],
    meta: INITIAL_META,
  });

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("asc"),
    },
    {
      history: "push",
    }
  );

  const router = useRouter();
  const [visibleColumns] = useState<Set<string>>(new Set(USER_VISIBLE_COL));
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return USER_COLUMNS;

    return USER_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_USER.getAllUsers(request);
      setUsers(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Server-side pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      setQuery({ page });
    },
    [setQuery]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setQuery({ limit: size, page: 1 }); // Reset to first page when changing page size
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setQuery({ search: search || null, page: 1 }); // Reset to first page when searching
    },
    [setQuery]
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setQuery({
        sortField: field,
        sortOrder: order,
        page: 1, // Reset to first page when sorting
      });
    },
    [setQuery]
  );

  const navigateToDetails = (user: User) => {
    // router.push(`${URLs.admin.users.details}${user._id}`);
    router.push(`${URLs.admin.users.detail.replace(":slug", user._id)}`);
  };
  const cellRenderers: Partial<Record<string, CellRenderer<User>>> = {
    firstname: (value, row) => (
      <span onClick={() => navigateToDetails(row)} className="font-medium">
        {row.firstname} {row.lastname}
      </span>
    ),

    email: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {value as string}
      </a>
    ),

    department: (value, row) => (
      <span className="text-sm">
        {row.departmentId
          ? `${row.departmentId.name} (${row.departmentId.code})`
          : "-"}
      </span>
    ),

    position: (value, row) => (
      <span className="text-sm">
        {row.positionId
          ? `${row.positionId.name} (${row.positionId.code})`
          : "-"}
      </span>
    ),

    branch: (value, row) => (
      <span className="text-sm">
        {row.branchId ? `${row.branchId.name} (${row.branchId.code})` : "-"}
      </span>
    ),

    role: (value, row) => (
      <Badge variant={row.role ? "default" : "outline"} className="text-xs">
        {row.role ? row.role.name : "No Role"}
      </Badge>
    ),

    createdAt: (value, row) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    is_active: (value) => (
      <div className="">
        {value ? (
          <Badge variant="active">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>
    ),

    actions: (value, row) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`${URLs.admin.users.edit.replace(":id", row._id)}`)
          }
          title="Edit User"
        >
          <PencilIcon className="size-4 text-blue-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(
              `${URLs.admin.users.detail.replace(":slug", row._id)}/permissions`
            )
          }
          title="Manage Permissions"
        >
          <ShieldCheck className="size-4 text-purple-500" />
        </Button>
      </div>
    ),
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add User",
      icon: UserRoundPlusIcon,
      permission: PERMISSIONS.USERS.CREATE,
      style: "",
      onClick: () => {
        router.push(URLs.admin.users.create);
      },
    },
    {
      label: "Add From Active Directory",
      icon: UserRoundPlusIcon,
      permission: PERMISSIONS.ACTIVE_DIRECTORY.CREATE_USER,
      style: "",

      wrapper: ({ children }) => (
        <UserFromADModal
          title="Select a User from Active Directory"
          description="Click the add icon to import user data to create a new user account"
        >
          {children}
        </UserFromADModal>
      ),
      onClick: () => "",
    },
    {
      label: "Bulk AD Sync",
      icon: RefreshCwIcon,
      permission: PERMISSIONS.ACTIVE_DIRECTORY.CREATE_USER,
      style: "",
      wrapper: ({ children }) => (
        <BulkADSyncModal
          title="AD User Sync with Manager"
          description="Sync all users from Active Directory and link their managers"
          onSyncComplete={getUsers}
        >
          {children}
        </BulkADSyncModal>
      ),
      onClick: () => "",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DataTable
          maxHeight="400px"
          data={users?.data}
          columns={headerColumns}
          // Server-side configuration
          serverSide={true}
          loading={loading}
          meta={users?.meta}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          onSort={handleSort}
          // Features
          enableSelection={false}
          enablePagination={true}
          enableSorting={true}
          enableGlobalSearch={true}
          enableColumnVisibility={true}
          // Customization
          searchPlaceholder="Search users..."
          emptyStateMessage="No users found."
          // Custom renderers
          cellRenderers={cellRenderers}
          additionalButtons={additionalButtons}
        />
      </div>
    </>
  );
};

export default UsersTable;
