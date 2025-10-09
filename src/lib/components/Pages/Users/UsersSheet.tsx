"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { handleServerError } from "@/lib/api/_axios";
import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/sheet";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAuthenticated } from "@/lib/types/user/user";
import { API_USER } from "@/lib/services/User/user_service";
import { Loader2 } from "lucide-react";

type UserSheetProps = {
  children: ReactNode;
  user: UserAuthenticated;
  callback?: () => void;
};

const UserSheet = ({ children, user, callback }: UserSheetProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update_schema = z.object({
    firstname: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastname: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Email is required"),
    is_super_admin: z.boolean(),
  });

  const form = useForm<z.infer<typeof update_schema>>({
    resolver: zodResolver(update_schema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      is_super_admin: false,
    },
  });

  const {
    formState: { errors, isDirty },
  } = form;

  const getUser = async () => {
    if (!user || !open) return;

    try {
      setLoading(true);

      const res = await API_USER.getUserById(user._id);

      form.reset({
        firstname: res.firstname || "",
        lastname: res.lastname || "",
        email: res.email || "",
        is_super_admin: res.is_super_admin || false,
      });
    } catch (error) {
      handleServerError(error, (msg) => {
        toast.error(msg);
      });
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  const updateUser = async (data: z.infer<typeof update_schema>) => {
    if (!user) return;

    try {
      setLoading(true);

      await API_USER.updateUserById(user._id, data);

      toast.success("User updated successfully");

      if (callback) {
        callback();
      }
      setSuccess(true);
    } catch (error) {
      handleServerError(error, (msg) => {
        toast.error(msg);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getUser();
    }
  }, []);

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          form.reset();
          setSuccess(false);
        }
        setOpen(val);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="gap-1 w-full">
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription className="text-muted-foreground text-base">
            Update user details and settings from here
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(updateUser)}
              className="space-y-6"
            >
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading user data...</span>
                </div>
              )}

              {!loading && (
                <>
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_super_admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Super Admin
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Grant super admin privileges to this user
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>

        <SheetFooter className="flex gap-2 sm:space-x-0 w-full">
          <SheetClose asChild>
            <Button variant="outline" className="w-full" disabled={loading}>
              Cancel
            </Button>
          </SheetClose>

          <Button
            type="button"
            onClick={form.handleSubmit(updateUser)}
            variant="default"
            className={`w-full font-semibold ${
              success ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            disabled={
              !isDirty || Object.keys(errors).length > 0 || loading || success
            }
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : success ? (
              "Updated!"
            ) : (
              "Update User"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
