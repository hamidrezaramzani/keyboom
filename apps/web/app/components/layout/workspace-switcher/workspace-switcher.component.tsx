"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  Check,
  Settings,
  Building,
  LogOut,
  CheckCircle,
  Circle,
  Building2,
  Archive,
  RotateCcw,
} from "lucide-react";
import { Popover } from "@/app/components/ui/popover/popover.component";
import { WorkspaceSettingsModal } from "@/app/components/sections/settings";
import {
  useLeaveWorkspaceMutation,
  useReadManyWorkspacesQuery,
  useRestoreWorkspaceMutation,
  useUpdateCurrentWorkspaceMutation,
  Workspace,
} from "@/app/services/workspace";
import { toast } from "@/app/lib";
import { useConfirm } from "@/app/lib/store/context";
import { EmptyState } from "../../ui";

interface WorkspaceSwitcherProps {
  onAddWorkspace: () => void;
}

export const WorkspaceSwitcher = ({
  onAddWorkspace,
}: WorkspaceSwitcherProps) => {
  const [updateCurrentWorkspace] = useUpdateCurrentWorkspaceMutation();
  const [restoreWorkspace] = useRestoreWorkspaceMutation();
  const [leaveWorkspace] = useLeaveWorkspaceMutation();
  const { data: workspacesData } = useReadManyWorkspacesQuery({});
  const workspaces = workspacesData?.list;

  const activeWorkspaces = workspaces?.filter((ws) => !ws.isArchive);
  const archiveWorkspace = workspaces?.filter((ws) => ws.isArchive);

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

  const handleRestoreWorkspace = async (
    workspace: Workspace,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: "بازیابی فضای کاری",
      description: `آیا از بازیابی فضای کاری "${workspace.name}" مطمئن هستید؟ این فضا دوباره در لیست فعال شما قرار می‌گیرد.`,
      confirmText: "بازیابی",
      variant: "info",
    });

    if (!confirmed) return;

    try {
      await restoreWorkspace({
        params: { workspaceId: workspace.id },
      }).unwrap();
      toast.success("فضای کاری با موفقیت بازیابی شد");
    } catch (error) {
      toast.error("خطا در بازیابی فضای کاری");
      console.error("Restore workspace error:", error);
    }
  };
  const content = (
    <div className="w-64">
      <div className="p-2">
        <div className="flex justify-between  px-3 py-2">
          <span className="text-gray-500 text-xs">فضاهای کاری شما</span>
        </div>
        {activeWorkspaces?.length ? (
          <>
            {activeWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="flex items-center justify-between hover:bg-gray-700 rounded-lg"
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
          </>
        ) : (
          <EmptyState icon={Building2} title="چیزی یافت نشد" />
        )}

        {archiveWorkspace?.length ? (
          <>
            <div className="border-t border-gray-700 my-2" />
            <div className="text-xs text-gray-500 px-3 py-2">
              فضاهای کاری آرشیو شده
            </div>
            {archiveWorkspace?.map((workspace) => (
              <div
                key={workspace.id}
                className="flex items-center justify-between hover:bg-gray-700/50 rounded-lg opacity-70"
              >
                <button
                  onClick={() =>
                    handleWorkspaceChange(workspace.id, workspace.name)
                  }
                  className="flex-1 flex items-center justify-between px-3 py-2 text-sm text-gray-400 transition-colors"
                >
                  <span className="truncate">{workspace.name}</span>
                  <Archive className="w-3 h-3 text-gray-500 shrink-0" />
                </button>
                <button
                  onClick={(e) => handleRestoreWorkspace(workspace, e)}
                  className="p-2 text-gray-500 hover:text-indigo-400 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        ) : null}
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

  const workspacesLength = workspaces ? workspaces.length : 0;
  const isLastWorkspace = workspacesLength <= 1;

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
        isLastWorkspace={isLastWorkspace}
      />
    </>
  );
};
