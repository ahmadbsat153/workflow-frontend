import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}> & { className?: string };
const SectionContainer = ({ children, className }: Props) => {
  return (
    <div
      className={`w-full h-full px-2 xl:px-8 2xl:px-18 pt-8 mb-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
