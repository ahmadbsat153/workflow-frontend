"use client";

import { ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";

type PermissionGuardProps = {
  /**
   * The permission(s) required to render the children
   * Can be a single permission string or an array of permissions
   */
  permission: string | string[];

  /**
   * If true, user needs ALL permissions. If false, user needs ANY permission.
   * Only applies when permission is an array. Default: false (ANY)
   */
  requireAll?: boolean;

  /**
   * The content to render if user has permission
   */
  children: ReactNode;

  /**
   * Optional fallback to render if user doesn't have permission
   */
  fallback?: ReactNode;
};

/**
 * Component that conditionally renders children based on user permissions
 *
 * @example
 * // Single permission
 * <PermissionGuard permission="users.view">
 *   <UsersTable />
 * </PermissionGuard>
 *
 * @example
 * // Multiple permissions (user needs ANY)
 * <PermissionGuard permission={["users.edit", "users.create"]}>
 *   <EditButton />
 * </PermissionGuard>
 *
 * @example
 * // Multiple permissions (user needs ALL)
 * <PermissionGuard permission={["users.edit", "users.view"]} requireAll>
 *   <EditButton />
 * </PermissionGuard>
 *
 * @example
 * // With fallback
 * <PermissionGuard
 *   permission="users.delete"
 *   fallback={<p>You don't have permission to delete users</p>}
 * >
 *   <DeleteButton />
 * </PermissionGuard>
 */
export const PermissionGuard = ({
  permission,
  requireAll = false,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  let hasAccess = false;

  if (Array.isArray(permission)) {
    hasAccess = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  } else {
    hasAccess = hasPermission(permission);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
