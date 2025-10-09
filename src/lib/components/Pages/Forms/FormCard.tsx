import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { LucideIcon, PencilIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/lib/ui/button";
import Link from "next/link";
import { getUrl, URLs } from "@/lib/constants/urls";
import { build_path } from "@/utils/common";

type FormCardProps = {
  title: string;
  form_id?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  iconBackgroundColor?: string;
  variant?: "default" | "create";
  editable?: boolean;
};

const FormCard = ({
  title,
  form_id,
  description,

  editable = false,
  icon: Icon = Plus,
  iconColor = "white",
  iconBackgroundColor = "bg-green-500",

  onClick,
  className,
  disabled = false,
  variant = "default",
}: FormCardProps) => {
  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        "h-full transition-all duration-200 pb-0 pt-2",
        isClickable &&
          !disabled &&
          "cursor-pointer hover:shadow-md hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        variant === "create" && "border-dashed border-2",
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex w-full justify-end ">
          {editable && form_id ? (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link
                href={getUrl(
                  build_path(URLs.admin.forms.edit, {
                    id: form_id,
                  })
                )}
              >
                <PencilIcon className="!size-4 text-blue-500" />
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 justify-center">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            iconBackgroundColor
          )}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col h-full items-center text-center space-y-2 border-t-1 py-4">
        {/* Title */}
        <CardTitle className="text-lg font-medium text-gray-900">
          {title}
        </CardTitle>

        {/* Description */}
        {description && (
          <CardDescription className="text-sm text-gray-500 max-w-xs">
            {description}
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormCard;
