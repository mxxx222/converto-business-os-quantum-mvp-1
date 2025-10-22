"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="neotech"
      themes={["neotech", "nordic", "system"]}
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
