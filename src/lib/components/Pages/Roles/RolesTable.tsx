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
import { ShieldPlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { Role, RoleTable as RoleTableType } from "@/lib/types/role/role";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { DataTable } from "../../Table/DataTable";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ROLE_COLUMNS, ROLE_VISIBLE_COL } from "@/lib/constants/tables";
import { URLs } from "@/lib/constants/urls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/ui/alert-dialog";

const RolesTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [roles, setRoles] = useState<RoleTableType>({
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
  const [visibleColumns] = useState<Set<string>>(new Set(ROLE_VISIBLE_COL));
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return ROLE_COLUMNS;

    return ROLE_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_ROLE.getAllRoles(request);
      setRoles(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, query]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  // Server-side pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      setQuery({ page });
    },
    [setQuery]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setQuery({ limit: size, page: 1 });
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setQuery({ search: search || null, page: 1 });
    },
    [setQuery]
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setQuery({
        sortField: field,
        sortOrder: order,
        page: 1,
      });
    },
    [setQuery]
  );

  const navigateToEdit = (role: Role) => {
    router.push(URLs.admin.roles.edit.replace(":id", role._id));
  };

  const handleDelete = (roleId: string) => {
    setRoleToDelete(roleId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await API_ROLE.deleteRole(roleToDelete);
      toast.success("Role deactivated successfully");
      getRoles();
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const cellRenderers: Partial<Record<string, CellRenderer<Role>>> = {
    name: (value, row) => (
      <span
        onClick={() => navigateToEdit(row)}
        className="font-medium cursor-pointer hover:text-primary"
      >
        {value as string}
      </span>
    ),

    description: (value) => (
      <span className="text-sm text-muted-foreground line-clamp-2">
        {(value as string) || "-"}
      </span>
    ),

    isSystemRole: (value) => (
      <div>
        {value ? (
          <Badge variant="secondary" className="text-xs">
            System
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            Custom
          </Badge>
        )}
      </div>
    ),

    isActive: (value) => (
      <div>
        {value ? (
          <Badge variant="active">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>
    ),

    createdAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    actions: (value, row) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigateToEdit(row)}>
          <PencilIcon className="size-4 text-blue-500" />
        </Button>
        {!row.isSystemRole && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2Icon className="size-4 text-red-500" />
          </Button>
        )}
      </div>
    ),
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add Role",
      icon: ShieldPlusIcon,
      style: "bg-primary text-primary-foreground hover:bg-primary/60",
      onClick: () => {
        router.push(URLs.admin.roles.create);
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DataTable
          data={roles?.data}
          columns={headerColumns}
          // Server-side configuration
          serverSide={true}
          loading={loading}
          meta={roles?.meta}
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
          searchPlaceholder="Search roles..."
          emptyStateMessage="No roles found."
          // Custom renderers
          cellRenderers={cellRenderers}
          additionalButtons={additionalButtons}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This won't acutally delete the role but will deactivate it. All
              users assigned to this role will not be able to access the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RolesTable;
