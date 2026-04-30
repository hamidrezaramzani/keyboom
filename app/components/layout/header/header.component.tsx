// app/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { Bell, Menu, Search, ChevronDown, Plus, Check } from "lucide-react";
import { Avatar } from "@/app/components/ui";
import { WorkspaceSwitcher } from "../workspace-switcher/workspace-switcher.component";

interface Workspace {
  id: string;
  name: string;
  isCurrent?: boolean;
}

interface HeaderProps {
  onMenuClick: () => void;
  user?: { name: string; email: string; avatar?: string | null };
  activeWorkspace?: Workspace;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

const mockWorkspaces: Workspace[] = [
  { id: "1", name: "شرکت کیان", isCurrent: true },
  { id: "2", name: "فضای شخصی" },
];

export const Header = ({
  onMenuClick,
  user,
  activeWorkspace,
  onWorkspaceChange,
}: HeaderProps) => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspaces] = useState(mockWorkspaces);
  const currentWorkspace =
    activeWorkspace || workspaces.find((w) => w.isCurrent);

  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-40 w-10/12">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:block relative w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="جستجو در اشتراک‌ها..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pr-10 pl-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <WorkspaceSwitcher
            currentWorkspace={activeWorkspace}
            onWorkspaceChange={onWorkspaceChange}
            onAddWorkspace={() => {
              /* باز کردن مودال ساخت workspace */
            }}
          />

          <button className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <Avatar name={user.name} src={user.avatar} />
              <div className="hidden lg:block">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
