// app/components/layout/WorkspaceSwitcher.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

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
  const activeWorkspace =
    currentWorkspace || workspaces.find((w) => w.isCurrent);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <span className="max-w-[120px] truncate">{activeWorkspace?.name}</span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2">
              فضاهای کاری شما
            </div>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  onWorkspaceChange?.(workspace);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="truncate">{workspace.name}</span>
                {workspace.isCurrent && (
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
              </button>
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
  );
};
