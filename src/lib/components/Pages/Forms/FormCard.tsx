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
import { build_path, formatDatesWithYearWithoutTime } from "@/utils/common";
import { formatDatesWithYear } from "@/utils/common";

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
  createdAt?: string;
  createdBy?: string;
};

const FormCard = ({
  title,
  form_id,
  description,
  createdAt = "",
  createdBy = "",

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
    <div className="relative">
      <Card
        className={cn(
          "h-full transition-all duration-200 pb-0 pt-2",
          isClickable &&
            !disabled &&
            "cursor-pointer hover:shadow-md hover:border-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          variant === "create" && "border-dashed border-2 hover:bg-primary/10",
          variant === "create" ? "bg-gray-50" : "bg-cultured",
          "rounded-2xl",
          className
        )}
        onClick={!disabled ? onClick : undefined}
      >
        <CardHeader>
          <div className="flex w-full">
            {variant !== "create" && (
              <CardTitle className="text-lg py-4 font-bold text-primary wrap-break-word">
                {title}
              </CardTitle>
            )}
            {editable && form_id ? (
              <div className="absolute top-0 right-0 z-20">
                {/* The MASKING Layer */}
                {/* This element is colored like the main page background (not the card) 
                    and is positioned to mask the curved corner of the card. */}
                <div className="relative">
                  <div className="absolute top-0 right-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-full bg-white z-10 flex justify-end">
                    <Button
                      variant={"link"}
                      size={"icon"}
                      className=""
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
                        <PencilIcon className="!size-[18px] text-pumpkin" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </CardHeader>
        {/* Icon */}
        {variant === "create" && (
          <CardContent className="flex flex-col items-center text-center space-y-4 justify-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                iconBackgroundColor
              )}
            >
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
            </div>
          </CardContent>
        )}
        <CardFooter
          className={`flex flex-col h-full space-y-4 pb-4 ${
            variant === "create" ? "items-center text-center" : "items-start"
          }`}
        >
          {/* Title */}
          {variant === "create" && (
            <CardTitle className="text-lg font-medium text-gray-900">
              {title}
            </CardTitle>
          )}
          {/* Description */}
          {description && (
            <CardDescription className="text-black flex-grow min-h-[3rem] max-h-[4rem] overflow-hidden">
              <span className="line-clamp-3">{description}</span>
            </CardDescription>
          )}
          {variant !== "create" && createdAt && createdBy && (
            <div className="flex flex-col items-end text-xs text-gray-500 mt-2 self-end">
              <span className="uppercase">{formatDatesWithYearWithoutTime(createdAt)}</span>
              {/* <span className="capitalize">By {createdBy}</span> */}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormCard;
