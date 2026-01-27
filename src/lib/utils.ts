import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormCanEdit } from "./types/form/form"
import { UserAuthenticated } from "./types/user/user"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if a user can edit a form based on the form's canEdit settings.
 *
 * @param user - The authenticated user object
 * @param canEdit - The form's canEdit settings (roles and positions)
 * @param creatorId - The ID of the user who created the form
 * @returns true if the user can edit the form, false otherwise
 *
 * Edit permission is granted if:
 * 1. User is a super admin
 * 2. User is the creator of the form
 * 3. canEdit settings are empty (no restrictions - defaults to creator only, handled by #2)
 * 4. User's role ID is in canEdit.roles
 * 5. User's position ID is in canEdit.positions
 */
export function canEditForm(
  user: UserAuthenticated | null | undefined,
  canEdit: FormCanEdit | undefined,
  creatorId?: string
): boolean {
  // No user means no edit permission
  if (!user) return false;

  // Super admins can always edit
  if (user.is_super_admin) return true;

  // Form creator can always edit their own form
  if (creatorId && user._id === creatorId) return true;

  // If no canEdit settings, only creator can edit (already handled above)
  if (!canEdit) return false;

  const { roles = [], positions = [] } = canEdit;

  // If both arrays are empty, only creator can edit (already handled above)
  if (roles.length === 0 && positions.length === 0) return false;

  // Check if user's role is in the allowed roles
  if (roles.length > 0 && user.role?.id) {
    if (roles.includes(user.role.id)) return true;
  }

  // Check if user's position is in the allowed positions
  if (positions.length > 0 && user.positionId) {
    const positionId = typeof user.positionId === 'string'
      ? user.positionId
      : user.positionId._id;
    if (positions.includes(positionId)) return true;
  }

  return false;
}
