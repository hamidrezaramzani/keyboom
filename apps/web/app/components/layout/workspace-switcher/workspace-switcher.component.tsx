// app/components/layout/WorkspaceSwitcher.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Plus, Check, Settings } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { WorkspaceSettingsModal } from "@/app/components/sections/settings";

interface Workspace {
  id: string;
  name: string;
  isCurrent?: boolean;
}

interface WorkspaceSwitcherProps {
  currentWorkspace?: Workspace;
  onWorkspaceChange?: (workspace: Workspace) => void;
  onAddWorkspace?: () => void;
  workspaces?: Workspace[];
}

const defaultWorkspaces: Workspace[] = [
  { id: "1", name: "شرکت کیان", isCurrent: true },
  { id: "2", name: "فضای شخصی" },
];

export const WorkspaceSwitcher = ({
  currentWorkspace,
  onWorkspaceChange,
  onAddWorkspace,
  workspaces = defaultWorkspaces,
}: WorkspaceSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );
  const activeWorkspace =
    currentWorkspace || workspaces.find((w) => w.isCurrent);

  const handleSettingsClick = (workspace: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setIsSettingsOpen(true);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <span className="max-w-[120px] truncate">
            {activeWorkspace?.name}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2">
                فضاهای کاری شما
              </div>
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between group"
                >
                  <button
                    onClick={() => {
                      onWorkspaceChange?.(workspace);
                      setIsOpen(false);
                    }}
                    className="flex-1 flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="truncate">{workspace.name}</span>
                    {workspace.isCurrent && (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleSettingsClick(workspace, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-300 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="border-t border-gray-700 my-1" />
              <button
                onClick={() => {
                  onAddWorkspace?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ساخت Workspace جدید</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <WorkspaceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workspace={selectedWorkspace}
      />
    </>
  );
};
