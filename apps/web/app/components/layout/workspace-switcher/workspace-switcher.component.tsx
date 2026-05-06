"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  Check,
  Settings,
  Building,
  LogOut,
} from "lucide-react";
import { Popover } from "@/app/components/ui/popover/popover.component";
import { WorkspaceSettingsModal } from "@/app/components/sections/settings";
import {
  useLeaveWorkspaceMutation,
  useReadManyWorkspacesQuery,
  useUpdateCurrentWorkspaceMutation,
  Workspace,
} from "@/app/services/workspace";
import { toast } from "@/app/lib";
import { useConfirm } from "@/app/lib/store/context";

interface WorkspaceSwitcherProps {
  onAddWorkspace: () => void;
}

export const WorkspaceSwitcher = ({
  onAddWorkspace,
}: WorkspaceSwitcherProps) => {
  const [updateCurrentWorkspace] = useUpdateCurrentWorkspaceMutation();
  const [leaveWorkspace] = useLeaveWorkspaceMutation();
  const { data: workspacesData } = useReadManyWorkspacesQuery({});
  const workspaces = workspacesData?.list;
  const currentWorkspace = workspacesData?.defaultWorkspace;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  const { confirm } = useConfirm();

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

  const handleWorkspaceLeave = async (
    workspace: Workspace,
    e: React.MouseEvent,
  ) => {
    try {
      e.stopPropagation();
      const confirmed = await confirm({
        title: "خروج فضای کاری",
        description: `آیا از خروج از این فضای کاری مطمئن هستید؟ این عمل غیرقابل بازگشت است.`,
        confirmText: "خروج",
        variant: "danger",
      });

      if (!confirmed) {
        return;
      }
      await leaveWorkspace({
        params: {
          workspaceId: workspace.id,
        },
      });

      toast.success(`خروج از فضای کاربری ${workspace.name} با موفقیت انجام شد`);
    } catch (error) {
      console.error(error);
      toast.error("خط در خروج از فضای از کاربری");
    }
  };

  const content = (
    <div className="w-64">
      <div className="p-2">
        <div className="text-xs text-gray-500 px-3 py-2">فضاهای کاری شما</div>
        {workspaces?.map((workspace) => (
          <div
            key={workspace.id}
            className="flex items-center justify-between hover:bg-gray-700 rounded-lg "
          >
            <button
              onClick={() =>
                handleWorkspaceChange(workspace.id, workspace.name)
              }
              className="flex-1 flex items-center justify-between px-3 py-2 text-sm text-gray-300 transition-colors"
            >
              <span className="truncate">{workspace.name}</span>
              {workspace.isCurrent && (
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
            </button>
            {workspace.isOwner ? (
              <button
                onClick={(e) => handleSettingsClick(workspace, e)}
                className="p-2 text-gray-500 hover:text-gray-300 transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => handleWorkspaceLeave(workspace, e)}
                className="p-2 text-gray-500 hover:text-red-300 transition-all"
              >
                <LogOut className="w-4 h-4 rotate-180" />
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
