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
import { Badge } from "@/lib/ui/badge";
import useDebounce from "@/lib/hooks/debounce";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { useEffect, useMemo, useState } from "react";
import { formatDatesWithYear } from "@/utils/common";
import { User, UserTable } from "@/lib/types/user/user";
import { INITIAL_META } from "@/lib/constants/initials";
import { API_USER } from "@/lib/services/User/user_service";
import { CellRenderer, DataTable } from "../../Table/DataTable";
import { USER_COLUMNS, USER_VISIBLE_COL } from "@/lib/constants/tables";

const UsersTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsString,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [users, setUsers] = useState<UserTable>({
    data: [],
    meta: INITIAL_META,
  });
  const [query] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsString.withDefault("25"),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("ascending"),
    },
    {
      history: "push",
    }
  );
  const [visibleColumns] = useState<Set<string>>(new Set(USER_VISIBLE_COL));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return USER_COLUMNS;

    return USER_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_USER.getAllUsers(request);

      setUsers(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
        setError(err_msg as string);
      });
    } finally {
      setLoading(false);
    }
  };

  useDebounce(
    () => {
      getUsers();
    },
    [query.search],
    1200
  );

  useEffect(() => {
    getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.sortField, query.sortOrder]);

  const cellRenderers: Partial<Record<string, CellRenderer<User>>> = {
    firstname: (value, row) => (
      <span className="font-medium">
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
          <Badge variant="destructive">Outline</Badge>
        )}
      </div>
    ),
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* <DataTable data={users?.data} columns={headerColumns} /> */}
        <DataTable
          data={users?.data}
          columns={headerColumns}
          enableSelection={false}
          enablePagination={true}
          cellRenderers={cellRenderers}
        />
      </div>
    </>
  );
};

export default UsersTable;
