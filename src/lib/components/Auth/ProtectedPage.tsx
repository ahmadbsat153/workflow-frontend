"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "../../hooks/usePermissions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { URLs } from "@/lib/constants/urls";

type ProtectedPageProps = {
  /**
   * The permission(s) required to access this page
   */
  permission: string | string[];

  /**
   * If true, user needs ALL permissions. If false, user needs ANY permission.
   * Only applies when permission is an array. Default: false (ANY)
   */
  requireAll?: boolean;

  /**
   * The page content
   */
  children: ReactNode;

  /**
   * Optional redirect URL if user doesn't have permission
   * Default: "/admin/dashboard"
   */
  redirectTo?: string;
};

/**
 * Component that protects an entire page based on permissions
 * Redirects to another page if user doesn't have required permissions
 *
 * @example
 * export default function UsersPage() {
 *   return (
 *     <ProtectedPage permission="users.view">
 *       <UsersTable />
 *     </ProtectedPage>
 *   );
 * }
 */
export const ProtectedPage = ({
  permission,
  requireAll = false,
  children,
  redirectTo = URLs.app.dashboard,
}: ProtectedPageProps) => {
  const router = useRouter();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  let hasAccess = false;

  if (Array.isArray(permission)) {
    hasAccess = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  } else {
    hasAccess = hasPermission(permission);
  }

  useEffect(() => {
    if (!hasAccess) {
      toast.error("You don't have permission to access this page");
      router.push(redirectTo);
    }
  }, [hasAccess, router, redirectTo]);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
};
