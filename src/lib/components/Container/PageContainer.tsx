import React from "react";

const PageContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <div className="w-full h-full px-2 xl:px-8 2xl:px-16 mb-2">{children}</div>;
};

export default PageContainer;
