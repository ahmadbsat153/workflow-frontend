import { useAuth } from "../context/AuthContext";

export const usePermissions = () => {
  const { user, isAdmin } = useAuth();

  /**
   * Check if the current user has a specific permission
   * @param permission - The permission key to check (e.g., "users.view")
   * @returns boolean - true if user has the permission
   *
   * Note: The backend calculates effective permissions (role + granted - denied)
   * and sends them in the permissions array, so we just need to check that array.
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }

    // Super admins have all permissions
    if (isAdmin) {
      return true;
    }

    // Check if permission exists in the effective permissions array
    const effectivePermissions = user.permissions || [];
    return effectivePermissions.includes(permission);
  };

  /**
   * Check if the current user has ALL of the specified permissions
   * @param permissions - Array of permission keys
   * @returns boolean - true if user has all permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  /**
   * Check if the current user has ANY of the specified permissions
   * @param permissions - Array of permission keys
   * @returns boolean - true if user has at least one permission
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  /**
   * Check if the current user is a super admin
   * @returns boolean - true if user is super admin
   */
  const isSuperAdmin = (): boolean => {
    return isAdmin;
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isSuperAdmin,
  };
};
