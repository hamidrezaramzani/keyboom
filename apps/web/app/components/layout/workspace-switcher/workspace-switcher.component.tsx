"use client";

import { useState } from "react";
import { ChevronDown, Plus, Check, Settings, Building } from "lucide-react";
import { Popover } from "@/app/components/ui/popover/popover.component";
import { WorkspaceSettingsModal } from "@/app/components/sections/settings";
import {
  useReadManyWorkspacesQuery,
  useUpdateCurrentWorkspaceMutation,
  Workspace,
} from "@/app/services/workspace";
import { toast } from "@/app/lib";

interface WorkspaceSwitcherProps {
  onAddWorkspace: () => void;
}

export const WorkspaceSwitcher = ({
  onAddWorkspace,
}: WorkspaceSwitcherProps) => {
  const [updateCurrentWorkspace] = useUpdateCurrentWorkspaceMutation();

  const { data: workspacesData } = useReadManyWorkspacesQuery({});
  const workspaces = workspacesData?.list;
  const currentWorkspace = workspacesData?.defaultWorkspace;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  const handleSettingsClick = (workspace: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setIsSettingsOpen(true);
  };

  const handleWorkspaceChange = async (
    workspaceId: string,
    workspaceName: string,
  ) => {
    try {
      await updateCurrentWorkspace({ payload: { workspaceId } }).unwrap();
      toast.success(`شما به فضای کاری «${workspaceName}» وارد شدید`);
    } catch {
      toast.error("خطا در تغییر فضای کاری");
    }
  };

  const trigger = (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700 text-white text-sm hover:bg-gray-800 transition-colors">
      <span className="w-full truncate flex gap-2 items-center">
        <Building size="15" />
        {currentWorkspace?.name}
      </span>
      <ChevronDown className="w-4 h-4 transition-transform" />
    </button>
  );

  const content = (
    <div className="w-64">
      <div className="p-2">
        <div className="text-xs text-gray-500 px-3 py-2">فضاهای کاری شما</div>
        {workspaces?.map((workspace) => (
          <div
            key={workspace.id}
            className="flex items-center justify-between group"
          >
            <button
              onClick={() =>
                handleWorkspaceChange(workspace.id, workspace.name)
              }
              className="flex-1 flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="truncate">{workspace.name}</span>
              {workspace.isCurrent && (
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
            </button>
            {workspace.isOwner && (
              <button
                onClick={(e) => handleSettingsClick(workspace, e)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-300 transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <div className="border-t border-gray-700 my-1" />
        <button
          onClick={() => {
            onAddWorkspace?.();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>ساخت Workspace جدید</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Popover
        trigger={trigger}
        content={content}
        position="bottom-left"
        width={256}
        offset={8}
      />

      <WorkspaceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workspace={selectedWorkspace}
      />
    </>
  );
};
