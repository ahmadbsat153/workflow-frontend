"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Switch } from "@/lib/ui/switch";
import { Label } from "@/lib/ui/label";

import { Badge } from "@/lib/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import type { Role } from "@/lib/types/role/role";

type BulkADSyncModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onSyncComplete?: () => void;
};

const BulkADSyncModal = ({
  children,
  title,
  description,
  onSyncComplete,
}: BulkADSyncModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [syncResult, setSyncResult] = useState<API_USER.BulkSyncResult | null>(
    null
  );

  // Sync options
  const [createNewUsers, setCreateNewUsers] = useState(true);
  const [defaultRoleCode, setDefaultRoleCode] = useState("TEAM_MEMBER");

  // Fetch active roles when modal opens
  useEffect(() => {
    if (isOpen && roles.length === 0) {
      fetchRoles();
    }
  }, [isOpen, roles.length]);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const activeRoles = await API_ROLE.getActiveRoles();
      setRoles(activeRoles);
      // Set default role if available
      if (activeRoles.length > 0 && !defaultRoleCode) {
        setDefaultRoleCode(activeRoles[0].code);
      }
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setRolesLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setSyncResult(null);

      const result = await API_USER.bulkSyncADUsersWithManager({
        createNewUsers,
        defaultRoleCode,
      });

      setSyncResult(result);
      toast.success(
        `Sync completed: ${result.created} created, ${result.updated} updated, ${result.managersLinked} managers linked`
      );
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!loading) {
      setIsOpen(open);
      if (!open) {
        // Call onSyncComplete when closing after a successful sync
        if (syncResult && onSyncComplete) {
          onSyncComplete();
        }
        // Reset state when closing
        setSyncResult(null);
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {!syncResult ? title : "Sync Results"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!syncResult ? description : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {!syncResult && (
            <>
              {/* Sync Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sync Options</h3>

                {/* Create New Users Toggle */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="create-new-users" className="font-medium">
                      Create new users
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create accounts for AD users that don&apos;t exist in the
                      system
                    </p>
                  </div>
                  <Switch
                    id="create-new-users"
                    checked={createNewUsers}
                    onCheckedChange={setCreateNewUsers}
                    disabled={loading}
                  />
                </div>

                {/* Default Role Selection */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-role" className="font-medium">
                      Default role
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Role assigned to newly created users
                    </p>
                  </div>
                  <Select
                    value={defaultRoleCode}
                    onValueChange={setDefaultRoleCode}
                    disabled={loading || rolesLoading || !createNewUsers}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role._id} value={role.code}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Warning Message */}
              <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Warning</p>
                  <p>
                    This operation will sync all users from Active Directory.
                    This may take several minutes depending on the number of
                    users. The operation cannot be undone.
                  </p>
                </div>
              </div>

              {/* Start Sync Button */}
              <Button
                onClick={handleSync}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Start Bulk Sync"
                )}
              </Button>
            </>
          )}

          {/* Results Section */}
          {syncResult && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {syncResult.synced}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Synced
                  </div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {syncResult.created}
                  </div>
                  <div className="text-xs text-muted-foreground">Created</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {syncResult.updated}
                  </div>
                  <div className="text-xs text-muted-foreground">Updated</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {syncResult.managersLinked}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Managers Linked
                  </div>
                </div>
              </div>

              {/* Errors Count */}
              {syncResult.errors > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    {syncResult.errors} error(s) occurred during sync
                  </span>
                </div>
              )}

              {/* Details Accordion */}
              <div className="space-y-3">
                {/* Created Users */}
                {syncResult?.details?.created?.length > 0 && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Created Users ({syncResult.details.created.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {syncResult.details.created.map((email: string) => (
                        <Badge
                          key={email}
                          variant="outline"
                          className="text-xs"
                        >
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Updated Users */}
                {syncResult.details.updated.length > 0 && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Updated Users ({syncResult.details.updated.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {syncResult.details.updated.map((email: string) => (
                        <Badge
                          key={email}
                          variant="outline"
                          className="text-xs"
                        >
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Managers Linked */}
                {syncResult.details.managersLinked.length > 0 && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        Managers Linked (
                        {syncResult.details.managersLinked.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {syncResult.details.managersLinked.map(
                        (email: string) => (
                          <Badge
                            key={email}
                            variant="outline"
                            className="text-xs"
                          >
                            {email}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Failed Users */}
                {syncResult.details.failed.length > 0 && (
                  <div className="rounded-lg border border-red-200 p-3 dark:border-red-900">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Failed Users ({syncResult.details.failed.length})
                      </span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {syncResult.details.failed.map(
                        (failure: { email: string; reason: string }) => (
                          <div
                            key={failure.email}
                            className="flex items-center justify-between text-xs bg-red-100 dark:bg-red-900/50 rounded px-2 py-1"
                          >
                            <span className="font-medium">{failure.email}</span>
                            <span className="text-red-600 dark:text-red-400">
                              {failure.reason}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkADSyncModal;
