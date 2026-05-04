// app/components/sections/settings/WorkspaceSettingsModal.tsx
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

const workspaceSettingsSchema = z.object({
  name: z.string().min(1, "نام فضای کاری الزامی است"),
});

type WorkspaceSettingsForm = z.infer<typeof workspaceSettingsSchema>;

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "علی حسینی",
    email: "ali@example.com",
    role: "owner",
    joinedAt: "۱۴۰۳/۰۱/۱۵",
  },
  {
    id: "2",
    name: "سارا محمدی",
    email: "sara@example.com",
    role: "admin",
    joinedAt: "۱۴۰۳/۰۲/۰۱",
  },
  {
    id: "3",
    name: "رضا کریمی",
    email: "reza@example.com",
    role: "member",
    joinedAt: "۱۴۰۳/۰۳/۱۰",
  },
];

type TabType = "general" | "members" | "danger";

export const WorkspaceSettingsModal = ({
  isOpen,
  onClose,
  workspace,
}: WorkspaceSettingsModalProps) => {
  const [updateWorkspaceSetting] = useUpdateWorkspaceSettingMutation();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [members, setMembers] = useState(mockMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isInviting, setIsInviting] = useState(false);

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
    console.log("Delete workspace:", workspace?.id);
    onClose();
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date().toLocaleDateString("fa-IR"),
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
    setIsInviting(false);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleChangeRole = (memberId: string, newRole: "admin" | "member") => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "general", label: "اطلاعات عمومی" },
    { id: "members", label: `اعضا (${members.length})` },
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
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3">
                دعوت عضو جدید
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="ایمیل"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                  containerClassName="flex-1"
                />
                <select
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as "admin" | "member")
                  }
                  className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm"
                >
                  <option value="admin">مدیر</option>
                  <option value="member">عضو</option>
                </select>
                <Button onClick={handleInvite} loading={isInviting}>
                  دعوت
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-800/30 rounded-xl gap-3"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {member.name}
                    </p>
                    <p className="text-gray-500 text-xs">{member.email}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      عضو از {member.joinedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role !== "owner" && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleChangeRole(
                              member.id,
                              e.target.value as "admin" | "member",
                            )
                          }
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white"
                        >
                          <option value="admin">مدیر</option>
                          <option value="member">عضو</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          حذف
                        </button>
                      </>
                    )}
                    {member.role === "owner" && (
                      <span className="text-xs text-amber-400">مالک</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          </div>
        )}
      </div>
    </Modal>
  );
};
