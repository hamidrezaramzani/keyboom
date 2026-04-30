'use client'
import { ReactNode } from "react";
import { Sidebar } from "../sidebar/sidebar.component";
import { Header } from "../header/header.component";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex w-full">
      <Sidebar
        collapsed={false}
        activeWorkspace={{ id: "1", name: "شرکت کیان" }}
        user={{ name: "علی حسینی", email: "ali@example.com" }}
      />
      <main className="w-10/12">
        <Header
          user={{ name: "علی حسینی", email: "ali@example.com" }}
          onMenuClick={console.log}
        />
        <div className="p-3">{children}</div>
      </main>
    </div>
  );
};
