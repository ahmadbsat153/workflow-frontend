import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/lib/ui/card";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBackgroundColor?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "create";
}

const FormCard = ({
  title,
  description,
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
        "h-full transition-all duration-200 pb-0",
        isClickable &&
          !disabled &&
          "cursor-pointer hover:shadow-md hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        variant === "create" && "border-dashed border-2",
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 justify-center h-[50%]">
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
