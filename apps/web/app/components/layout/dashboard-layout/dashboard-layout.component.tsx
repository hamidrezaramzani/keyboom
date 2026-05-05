"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "../sidebar/sidebar.component";
import { Header } from "../header/header.component";
import { Drawer } from "@/app/components/ui/drawer/drawer.component";
import { useGetMeQuery, useLogoutUserMutation } from "@/app/services";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib";
import { cn } from "@/app/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { push } = useRouter();
  const [logoutUser] = useLogoutUserMutation();
  const { data: user } = useGetMeQuery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const collapsedDraft = localStorage.getItem("sidebar-collapsed");
  const [collapsed, setCollapsed] = useState(
    collapsedDraft ? Boolean(collapsedDraft === "true") : false,
  );

  const handleLogout = async () => {
    await logoutUser();
    push("/login");
    toast.success("خروج با موفقیت انجام شد");
  };

  const handleCollapsed = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(!collapsed));
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={handleCollapsed}
          onLogout={handleLogout}
          user={user}
        />
      </div>

      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="left"
        size="full"
      >
        <Sidebar
          collapsed={false}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onLogout={() => {
            setIsMobileMenuOpen(false);
            handleLogout();
          }}
          user={user}
          isMobile={true}
        />
      </Drawer>

      <main
        className={cn("flex-1 w-full", "md:transition-all md:duration-300")}
      >
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} user={user} />
        <div className="p-3 md:p-6">{children}</div>
      </main>
    </div>
  );
};
