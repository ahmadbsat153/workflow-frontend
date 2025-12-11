# How to Use Permissions in Your Application

## 1. Protecting Entire Pages

Wrap your page content with `ProtectedPage` to require specific permissions:

```tsx
// app/(admin)/admin/users/page.tsx
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import UsersTable from "@/lib/components/Pages/Users/UsersTable";

export default function UsersPage() {
  return (
    <ProtectedPage permission="users.view">
      <PageContainer>
        <UsersTable />
      </PageContainer>
    </ProtectedPage>
  );
}
```

## 2. Conditionally Rendering UI Elements

Use `PermissionGuard` to show/hide buttons, sections, or any UI elements:

```tsx
import { PermissionGuard } from "@/lib/components/Auth/PermissionGuard";
import { Button } from "@/lib/ui/button";

export function UserActions({ userId }: { userId: string }) {
  return (
    <div className="flex gap-2">
      {/* Show Edit button only if user has edit permission */}
      <PermissionGuard permission="users.edit">
        <Button onClick={() => handleEdit(userId)}>
          Edit
        </Button>
      </PermissionGuard>

      {/* Show Delete button only if user has delete permission */}
      <PermissionGuard permission="users.delete">
        <Button variant="destructive" onClick={() => handleDelete(userId)}>
          Delete
        </Button>
      </PermissionGuard>

      {/* Show Manage Permissions button if user has ANY of these permissions */}
      <PermissionGuard permission={["users.manage_permissions", "roles.edit"]}>
        <Button onClick={() => handleManagePermissions(userId)}>
          Manage Permissions
        </Button>
      </PermissionGuard>
    </div>
  );
}
```

## 3. Using the Hook Directly

For more complex logic, use the `usePermissions` hook:

```tsx
"use client";

import { usePermissions } from "@/lib/hooks/usePermissions";
import { Button } from "@/lib/ui/button";

export function WorkflowActions() {
  const { hasPermission, isSuperAdmin } = usePermissions();

  const canEdit = hasPermission("workflows.edit");
  const canDelete = hasPermission("workflows.delete");
  const canViewAll = hasPermission("workflows.view_all_submissions");

  const handleSubmit = () => {
    if (!canEdit) {
      toast.error("You don't have permission to edit workflows");
      return;
    }

    // Proceed with submission
    submitWorkflow();
  };

  return (
    <div>
      {isSuperAdmin() && (
        <div className="bg-yellow-50 p-4 mb-4">
          <p>You're logged in as Super Admin - you have all permissions</p>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!canEdit}>
        Save Workflow
      </Button>

      {canViewAll && (
        <Button onClick={viewAllSubmissions}>
          View All Submissions
        </Button>
      )}
    </div>
  );
}
```

## 4. Protecting API Routes (Server-Side)

For server-side protection, create middleware or helper functions:

```tsx
// lib/auth/serverPermissions.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function requirePermission(permission: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  // Super admins have all permissions
  if (user.is_super_admin) {
    return true;
  }

  const rolePermissions = user.role?.permissions || [];
  const customGranted = user.customPermissions?.granted || [];
  const customDenied = user.customPermissions?.denied || [];

  // Check if denied
  if (customDenied.includes(permission)) {
    throw new Error("Forbidden: Permission denied");
  }

  // Check if granted
  const hasPermission =
    rolePermissions.includes(permission) ||
    customGranted.includes(permission);

  if (!hasPermission) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return true;
}

// Usage in API route:
// app/api/users/route.ts
export async function GET() {
  try {
    await requirePermission("users.view");

    // User has permission, proceed with request
    const users = await fetchUsers();
    return Response.json(users);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 403 }
    );
  }
}
```

## 5. Menu Items Based on Permissions

Hide menu items based on permissions:

```tsx
// lib/constants/menu.ts
import { usePermissions } from "@/lib/hooks/usePermissions";

export function useMenuItems() {
  const { hasPermission } = usePermissions();

  return [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      visible: true, // Always visible
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      visible: hasPermission("users.view"),
    },
    {
      label: "Roles",
      href: "/admin/roles",
      icon: Shield,
      visible: hasPermission("roles.view"),
    },
    {
      label: "Workflows",
      href: "/admin/workflows",
      icon: Workflow,
      visible: hasPermission("workflows.view"),
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: BarChart,
      visible: hasPermission("reports.view"),
    },
  ].filter(item => item.visible);
}
```

## 6. Form Fields Based on Permissions

Show/hide form fields based on permissions:

```tsx
export function UserForm() {
  const { hasPermission } = usePermissions();

  return (
    <Form>
      <FormField name="firstname" {...} />
      <FormField name="lastname" {...} />
      <FormField name="email" {...} />

      {/* Only super admins or users with manage_permissions can change roles */}
      <PermissionGuard permission="users.manage_permissions">
        <FormField name="role" {...} />
      </PermissionGuard>

      {/* Only show dangerous actions to authorized users */}
      <PermissionGuard permission="users.delete">
        <FormField name="is_archived" {...} />
      </PermissionGuard>
    </Form>
  );
}
```

## 7. Table Actions Based on Permissions

Show different action buttons per row based on permissions:

```tsx
const columns = [
  // ... other columns
  {
    id: "actions",
    cell: ({ row }) => {
      const { hasPermission } = usePermissions();

      return (
        <div className="flex gap-2">
          <PermissionGuard permission="users.view">
            <Button size="sm" onClick={() => viewUser(row.original._id)}>
              View
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="users.edit">
            <Button size="sm" onClick={() => editUser(row.original._id)}>
              Edit
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="users.delete">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteUser(row.original._id)}
            >
              Delete
            </Button>
          </PermissionGuard>
        </div>
      );
    },
  },
];
```

## Available Permissions

Based on your system, here are the available permissions:

### Workflows
- `workflows.view` - View workflow definitions
- `workflows.create` - Create new workflows
- `workflows.edit` - Edit workflows
- `workflows.delete` - Delete workflows
- `workflows.view_all_submissions` - View all submissions

### Forms
- `forms.view` - View forms
- `forms.create` - Create forms
- `forms.edit` - Edit forms
- `forms.delete` - Delete forms
- `forms.submit` - Submit forms
- `forms.view_submissions` - View submissions
- `forms.export_submissions` - Export submissions

### Organization
- `organization.view_branches` - View branches
- `organization.manage_branches` - Manage branches
- `organization.view_departments` - View departments
- `organization.manage_departments` - Manage departments
- `organization.view_positions` - View positions
- `organization.manage_positions` - Manage positions

### Users
- `users.view` - View users
- `users.create` - Create users
- `users.edit` - Edit users
- `users.delete` - Delete users
- `users.manage_permissions` - Manage user permissions

### Roles
- `roles.view` - View roles
- `roles.create` - Create roles
- `roles.edit` - Edit roles
- `roles.delete` - Delete roles

### Reports
- `reports.view` - View reports
- `reports.export` - Export reports
- `reports.view_analytics` - View analytics

### Files
- `files.view` - View files
- `files.upload` - Upload files
- `files.download` - Download files
- `files.delete` - Delete files

### System
- `system.view_logs` - View system logs
- `system.manage_settings` - Manage system settings

## Best Practices

1. **Always check permissions on both client and server**
   - Client-side: Hide UI elements
   - Server-side: Validate in API routes

2. **Use descriptive permission names**
   - Follow the pattern: `resource.action`
   - Examples: `users.view`, `workflows.create`

3. **Group related permissions**
   - Create roles with logical permission groups
   - Example: "Content Editor" role includes all content-related permissions

4. **Test with different user roles**
   - Always test with non-admin users
   - Verify permissions work as expected

5. **Provide helpful error messages**
   - Tell users why they can't access something
   - Guide them to request permissions if needed
