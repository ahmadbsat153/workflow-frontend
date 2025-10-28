import React from "react";

type Props = React.PropsWithChildren<{}> & { className?: string };

const PageContainer = ({ children, className }: Props) => {
  return (
    <div className={`w-full h-full px-2 xl:px-8 2xl:px-16 pt-8 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
