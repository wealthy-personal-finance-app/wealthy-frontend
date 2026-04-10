"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#191B1F',
          color: '#E1E4EA',
          border: '1px solid #2E2F33',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
