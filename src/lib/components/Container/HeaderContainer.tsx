import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  title: ReactNode | undefined;
  description?: string;
  children?: ReactNode;
};

const HeaderContainer = ({ children, title, description }: Props) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 w-full py-3 lg:py-4 -mt-6">
      {title && (
        <div className="flex flex-col leading-5 sm:px-2 sm:py-3">
          <div className="text-base sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-0 dark:text-white text-black">
            {title}
          </div>
          {description && (
            <p className="text-xs sm:text-sm lg:text-lg text-default-500">
              {description}
            </p>
          )}
        </div>
      )}

      {children && (
        <div className={cn(!title && "w-full", "md:px-4")}>{children}</div>
      )}
    </div>
  );
};

export default HeaderContainer;
