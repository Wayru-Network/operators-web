"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { updateSession } from "../session/session";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  initialIsCollapsed,
}: {
  children: React.ReactNode;
  initialIsCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed ?? false);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    updateSession({ isCollapsed: newState });
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
