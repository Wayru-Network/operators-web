import { Spinner } from "@heroui/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isLoading?: boolean;
  startContent?: ReactNode;
}
export const LoadingInputWrapper = ({
  children,
  isLoading,
  startContent,
}: Props) => (
  <div className="flex flex-row w-full relative items-center w-full">
    {startContent && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {startContent}
      </div>
    )}
    {children}
    {isLoading && (
      <div className="absolute right-1.5">
        <Spinner size="sm" />
      </div>
    )}
  </div>
);
