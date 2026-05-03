"use client";
import { ReactNode } from "react";
import { Sidebar } from "../sidebar/sidebar.component";
import { Header } from "../header/header.component";
import { useLogoutUserMutation } from "@/app/services";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { push } = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
    push("/login");
    toast.success("خروج با موفقیت انجام شد");
  };

  return (
    <div className="flex w-full">
      <Sidebar
        collapsed={false}
        activeWorkspace={{ id: "1", name: "شرکت کیان" }}
        user={{ name: "علی حسینی", email: "ali@example.com" }}
        onLogout={handleLogout}
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
