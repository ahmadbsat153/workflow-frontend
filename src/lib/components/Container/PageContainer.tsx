import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}> & { className?: string };

const PageContainer = ({ children, className }: Props) => {
  return (
    <div className={`w-full h-full px-4 lg:px-2 xl:px-8 2xl:px-12 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
