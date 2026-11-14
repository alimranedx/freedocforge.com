"use client";

import React from "react";
import { UserDashboardProvider } from "@/context/UserDashboardContext";
import UserWorkspaceShell from "@/components/UserWorkspaceShell";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserDashboardProvider>
      <UserWorkspaceShell alwaysWorkspace={true}>{children}</UserWorkspaceShell>
    </UserDashboardProvider>
  );
}
