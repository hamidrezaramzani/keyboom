"use client";

import { Menu, MessageSquare, Search } from "lucide-react";
import { WorkspaceSwitcher } from "../workspace-switcher/workspace-switcher.component";
import { NotificationPopover } from "@/app/components/sections/notifications";
import { AddWorkspaceModal } from "../../sections";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);

  const { push } = useRouter();

  const handlRedirectToTicket = () => {
    push("/dashboard/ticket");
  };

  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
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
            onAddWorkspace={() => setIsAddWorkspaceOpen(true)}
          />

          <NotificationPopover />

          <button
            className="relative pl-2 text-gray-400 hover:text-white rounded-lg transition-colors"
            onClick={handlRedirectToTicket}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AddWorkspaceModal
        isOpen={isAddWorkspaceOpen}
        onClose={() => setIsAddWorkspaceOpen(false)}
      />
    </header>
  );
};
