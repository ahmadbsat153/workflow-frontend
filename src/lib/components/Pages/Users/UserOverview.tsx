"use client";

import {
  MailIcon,
  LockIcon,
  Briefcase,
  CheckCircle,
  ArchiveIcon,
  CircleXIcon,
  PhoneCallIcon,
  CircleUserRound,
} from "lucide-react";

import { formatDatesWithYear } from "@/utils/common";
import { User } from "@/lib/types/user/user";

const UserOverview = ({ data }: { data: User | null }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        No user data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* IMAGE SECTION */}
      <div className="flex items-center gap-3 py-5 border-b-2 border-b-gray-100">
        <div className="w-18 h-18 overflow-hidden rounded-full bg-purple-400 text-white flex items-center justify-center text-2xl">
          <span>{data.firstname?.slice(0, 1) || ""}</span>
          <span>{data.lastname?.slice(0, 1) || ""}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-5">
            <span className=" text-2xl font-bold">
              {data.firstname} {data.lastname}
            </span>
            {data.is_archived ? (
              <span className="flex items-center gap-1 bg-archived-foreground text-archived px-2 py-1 rounded-md text-xs">
                <ArchiveIcon className="size-3" />
                Archived
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-unarchived-foreground text-unarchived px-2 py-1 rounded-md text-xs">
                <LockIcon className="size-[9px]" />
                Not Archived
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            {data.is_active ? (
              <span className="text-xs text-active flex items-center gap-1">
                <CheckCircle className="size-3" />
                Active
              </span>
            ) : (
              <span className="text-xs text-destructive items-center gap-1">
                <CircleXIcon className="size-3" />
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>
      {/* GENERAL INFO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-dark border-b-2 border-b-gray-100 pb-5">
        <div className="flex items-center gap-3 text-sm">
          <CircleUserRound className="size-3" />
          <span className="font-semibold">Username</span>
          {data.firstname} {data.lastname}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <PhoneCallIcon className="size-3" />
          <span className="font-semibold">Phone</span>
          {data.phone || "N/A"}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MailIcon className="size-3" />
          <span className="font-semibold">Email</span>
          {data.email || "N/A"}
        </div>
      </div>
      {/* ORGANIZATION INFO SECTION */}
      <div className="text-dark border-b-2 border-b-gray-100 pb-5 w-full">
        <div className="flex items-center border rounded-b-md relative w-full text-sm py-3">
          <span className="p-4">
            <Briefcase className="size-8" />
          </span>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">
              Gold Tiger Logistics Solutions
            </span>
            <span className="text-xs font-normal">
              {typeof data.role === "object" && data.role?.name
                ? data.role.name
                : typeof data.role === "string"
                ? data.role
                : "N/A"}
            </span>
          </div>
          <div className="absolute right-0 text-xs font-medium">
            <span className="p-4">
              since {formatDatesWithYear(data.createdAt) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
