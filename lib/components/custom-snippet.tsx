import { Snippet } from "@heroui/react";
import React from "react";

interface CustomSnippetProps {
  label: string;
  children: React.ReactNode;
  wrapperClass?: string;
  labelClass?: string;
  snippetClass?: string;
}

export default function CustomSnippet(
  props: CustomSnippetProps & React.ComponentProps<typeof Snippet>,
) {
  const {
    label,
    children,
    wrapperClass = "",
    labelClass = "",
    snippetClass = "",
    ...rest
  } = props;

  return (
    <div className={`relative w-full ${wrapperClass}`}>
      <label
        className={`absolute bg-[#ffffff] dark:bg-[#191c1d] px-2 w-fit left-3 -top-3 text-sm text-neutral-600 dark:text-neutral-400 ${labelClass}`}
      >
        {label}
      </label>
      <Snippet
        hideSymbol={true}
        {...rest}
        className={`w-full border-2 border-neutral-300 rounded-[4px] ${snippetClass}`}
        classNames={{
          base: "bg-transparent",
          content: "bg-transparent",
          pre: "bg-transparent text-lg px-4 py-4",
          ...rest.classNames,
        }}
      >
        {children}
      </Snippet>
    </div>
  );
}
