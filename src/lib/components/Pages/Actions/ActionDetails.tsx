"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import * as Icons from "lucide-react";

import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Separator } from "@/lib/ui/separator";

import { API_ACTION } from "@/lib/services/Actions/action_service";
import { Action } from "@/lib/types/actions/action";
import { getUrl, URLs } from "@/lib/constants/urls";
import { build_path } from "@/utils/common";

type ActionDetailsProps = {
  action_id: string;
};

export const ActionDetails = () => {
  const params = useParams();
  const action_id = params.action_id as string;
  const router = useRouter();
  const [action, setAction] = useState<Action | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAction = async () => {
      try {
        setIsLoading(true);
        const data = await API_ACTION.getActionById(action_id);

        if (data) {
          setAction(data);
        } else {
          toast.error("Action not found");
          router.push(URLs.admin.actions.index);
        }
      } catch (error) {
        console.error("Error fetching action:", error);
        toast.error("Failed to load action");
        router.push(URLs.admin.actions.index);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAction();
  }, [action_id, router]);

  const handleEdit = () => {
    router.push(
      getUrl(build_path(URLs.admin.actions.edit, { action_id: action_id }))
    );
  };

  const handleBack = () => {
    router.push(URLs.admin.actions.index);
  };

  // Get the icon component dynamically
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons];
    return Icon || Icons.Zap; // Fallback to Zap if not found
  };

  // Usage
  const DynamicIcon = ({
    name,
    className,
  }: {
    name: string;
    className?: string;
  }) => {
    const Icon = getIcon(name) as Icons.LucideIcon;
    return <Icon className={className} />;
  };
  // Get field type badge color
  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: "bg-slate-100 text-slate-800",
      email: "bg-blue-100 text-blue-800",
      select: "bg-purple-100 text-purple-800",
      textarea: "bg-indigo-100 text-indigo-800",
      number: "bg-green-100 text-green-800",
      boolean: "bg-amber-100 text-amber-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading action...</span>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Action not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Actions
        </Button>

        <div className="flex gap-2">
          <Button variant="default" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl flex gap-2 justify-center items-center">
                  {action.icon && (
                    <DynamicIcon
                      name={action.icon}
                      className="h-5 w-5 text-pumpkin"
                    />
                  )}
                  {action.displayName}
                </CardTitle>
                <CardDescription className="mt-1">
                  {action.actionName}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={action.isActive ? "active" : "tertiary"}>
                {action.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {action.actionDescription}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Category</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {action.category}
            </p>
          </div>
          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Created At</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(action.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(action.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Fields Card */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Fields</CardTitle>
          <CardDescription>
            Fields required to configure this action in workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {action.configSchema.fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No configuration fields defined
            </div>
          ) : (
            <div className="space-y-4">
              {action.configSchema.fields.map((field, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{field.label}</h4>
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                        {field.supportsTemplate && (
                          <Badge variant="outline" className="text-xs">
                            Template Support
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Field name:{" "}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {field.name}
                        </code>
                      </p>
                    </div>
                    <Badge className={getFieldTypeColor(field.type)}>
                      {field.type}
                    </Badge>
                  </div>

                  {field.actionDescription && (
                    <p className="text-sm text-muted-foreground">
                      {field.actionDescription}
                    </p>
                  )}

                  {field.placeholder && (
                    <p className="text-xs text-muted-foreground">
                      Placeholder: "{field.placeholder}"
                    </p>
                  )}

                  {field.defaultValue && (
                    <p className="text-xs text-muted-foreground">
                      Default: {String(field.defaultValue)}
                    </p>
                  )}

                  {field.options && field.options.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((option, optIndex) => (
                          <Badge key={optIndex} variant="outline">
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
