/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import UserSheet from "./UsersSheet";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { UserRoundPlusIcon } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { User, UserTable } from "@/lib/types/user/user";
import { API_USER } from "@/lib/services/User/user_service";
import { DataTable } from "../../Table/DataTable";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { USER_COLUMNS, USER_VISIBLE_COL } from "@/lib/constants/tables";

const UsersTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

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
  const handlePageChange = useCallback((page: number) => {
    setQuery({ page });
  }, [setQuery]);

  const handlePageSizeChange = useCallback((size: number) => {
    setQuery({ limit: size, page: 1 }); // Reset to first page when changing page size
  }, [setQuery]);

  const handleSearch = useCallback((search: string) => {
    setQuery({ search: search || null, page: 1 }); // Reset to first page when searching
  }, [setQuery]);

  const handleSort = useCallback((field: string, order: "asc" | "desc") => {
    setQuery({ 
      sortField: field, 
      sortOrder: order,
      page: 1 // Reset to first page when sorting
    });
  }, [setQuery]);

  const navigateToDetails = ((user: User) => {
    router.push(`/admin/users/${user._id}`);
  })
  const cellRenderers: Partial<Record<string, CellRenderer<User>>> = {
    firstname: (value, row) => (
      <span onClick={()=>navigateToDetails(row)} className="font-medium">
        {row.firstname} {row.lastname}
      </span>
    ),

    email: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {value}
      </a>
    ),

    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },
    
    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
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
      <UserSheet user={row} callback={getUsers}>
        <Button variant="ghost" size="sm">
          <PencilIcon className="size-4 text-blue-500" />
        </Button>
      </UserSheet>
    ),
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add User",
      icon: UserRoundPlusIcon,
      style: "bg-primary text-primary-foreground hover:bg-primary/60",
      onClick: () => {
        router.push("/admin/users/create");
      },
    },
  ]
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DataTable
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