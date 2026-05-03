"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Avatar } from "@/app/components/ui";
import { Me } from "@/app/services";
import { useReadManyWorkspacesQuery } from "@/app/services/workspace";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  activeWorkspace?: { id: string; name: string };
  user?: Me;
  onLogout?: () => void;
}

const navItems = [
  { name: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { name: "اشتراک‌ها", href: "/subscriptions", icon: Package },
  { name: "تنظیمات", href: "/settings", icon: Settings },
];

export const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
  user,
  onLogout,
}: SidebarProps) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const { data: workspaceData } = useReadManyWorkspacesQuery({});
  const currentWorkspace = workspaceData?.data.defaultWorkspace;

  return (
    <aside
      className={cn(
        "w-2/12 md:flex hidden h-screen bg-gray-900/90 backdrop-blur-md border-l border-gray-800 z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-2/12",
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-gray-800 py-4",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              KeyBoom
            </span>
          </div>
        )}

        {collapsed && (
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden md:block text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {!collapsed && currentWorkspace && (
        <div className="mx-4 mt-4 p-2 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-500">فضای کاری فعلی</p>
          <p className="text-sm text-white font-medium truncate">
            {currentWorkspace?.name}
          </p>
        </div>
      )}

      {!collapsed && user && (
        <div className="mx-4 mt-4 p-3 bg-gray-800/30 rounded-xl flex items-center gap-3">
          <Avatar name={user.fullName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user.fullName}
            </p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200",
            "text-gray-400 hover:bg-red-500/10 hover:text-red-400",
            collapsed && "justify-center",
          )}
          title={collapsed ? "خروج" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">خروج</span>}
        </button>
      </div>
    </aside>
  );
};
