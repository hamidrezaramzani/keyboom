"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import { cn } from "@/app/lib/utils";
import {
  useUpdateWorkspaceSettingMutation,
  Workspace,
} from "@/app/services/workspace";
import { toast } from "@/app/lib";
import { WorkspaceMembersSettingTab } from "./members/workspace-members-tab.component";

const workspaceSettingsSchema = z.object({
  name: z.string().min(1, "نام فضای کاری الزامی است"),
});

type WorkspaceSettingsForm = z.infer<typeof workspaceSettingsSchema>;

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
}

type TabType = "general" | "members" | "danger";

export const WorkspaceSettingsModal = ({
  isOpen,
  onClose,
  workspace,
}: WorkspaceSettingsModalProps) => {
  const [updateWorkspaceSetting] = useUpdateWorkspaceSettingMutation();

  const [activeTab, setActiveTab] = useState<TabType>("general");

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<WorkspaceSettingsForm>({
    resolver: zodResolver(workspaceSettingsSchema),
    values: {
      name: workspace?.name || "",
    },
  });

  const onSubmit = async (data: WorkspaceSettingsForm) => {
    try {
      if (!workspace?.id) {
        console.error("Workspace id is not found");
        return;
      }

      await updateWorkspaceSetting({
        payload: data,
        params: {
          workspaceId: workspace?.id,
        },
      }).unwrap();

      toast.success("به روزرسانی تنظیمات فضای کاری با موفقیت انجام شد");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("خطا در به روز رسانی تنظیمات فضای کاری");
    }
  };

  const handleDeleteWorkspace = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.info("Delete workspace:", workspace?.id);
    onClose();
  };

  const handleArchiveWorkspace = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.info("Archive workspace:", workspace?.id);
    onClose();
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "general", label: "اطلاعات عمومی" },
    { id: "members", label: `اعضا` },
    { id: "danger", label: "حذف فضای کاری" },
  ];

  if (!workspace) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تنظیمات ${workspace.name}`}
      size="lg"
    >
      <div className="border-b border-gray-800 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative",
                activeTab === tab.id
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-gray-300",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "general" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="نام فضای کاری"
              placeholder="مثال: شرکت کیان"
              error={errors.name?.message}
              {...register("name")}
            />
            <div className="pt-4">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        )}

        {activeTab === "members" && (
          <WorkspaceMembersSettingTab workspace={workspace} />
        )}

        {activeTab === "danger" && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h4 className="text-red-400 text-sm font-medium mb-2">
                حذف فضای کاری
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                با حذف این فضای کاری، تمام گروه‌ها، اشتراک‌ها و داده‌های مرتبط
                برای همیشه حذف می‌شوند. این عمل قابل بازگشت نیست.
              </p>
              <Button variant="danger" onClick={handleDeleteWorkspace}>
                حذف فضای کاری
              </Button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h4 className="text-amber-400 text-sm font-medium mb-2">
                آرشیو فضای کاری
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                با آرشیو این فضای کاری، از لیست فعال شما مخفی می‌شود اما داده‌ها
                حفظ می‌شوند. در صورت نیاز می‌توانید بعداً آن را بازیابی کنید.
              </p>
              <Button variant="outline" onClick={handleArchiveWorkspace}>
                آرشیو فضای کاری
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
