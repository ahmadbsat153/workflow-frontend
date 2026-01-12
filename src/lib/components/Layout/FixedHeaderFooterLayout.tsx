import { Card, CardContent, CardFooter } from "@/lib/ui/card";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ReactNode } from "react";

type FixedHeaderFooterLayoutProps = {
  title: ReactNode | undefined;
  description?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  maxHeight?: string;
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

const FixedHeaderFooterLayout = ({
  title,
  description,
  headerActions,
  children,
  footer,
  maxWidth = "3xl",
  maxHeight = "90vh",
}: FixedHeaderFooterLayoutProps) => {
  return (
    <PageContainer className="bg-cultured !p-0 flex justify-center overflow-hidden">
      <div className={`w-full ${maxWidthClasses[maxWidth]} flex items-center`}>
        <Card
          className="w-full flex flex-col gap-0"
          style={{ maxHeight: maxHeight }}
        >
          {/* Header Section */}
          <div className="flex-shrink-0 px-6">
            <HeaderContainer title={title} description={description}>
              {headerActions}
            </HeaderContainer>
          </div>

          {/* Scrollable Content */}
          <CardContent className="flex-1 overflow-y-auto min-h-0 py-2">
            {children}
          </CardContent>

          {/* Footer Section */}
          {footer && <CardFooter className="border-t flex-shrink-0">{footer}</CardFooter>}
        </Card>
      </div>
    </PageContainer>
  );
};

export default FixedHeaderFooterLayout;
