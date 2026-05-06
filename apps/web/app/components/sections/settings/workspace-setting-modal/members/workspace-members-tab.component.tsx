"use client";

import { Button, EmptyState, Input } from "@/app/components/ui";
import { toast } from "@/app/lib";
import { useCreateInvitationMutation } from "@/app/services/invite/api-invite.endpoint";
import {
  useGetWorkspaceMembersQuery,
  Workspace,
} from "@/app/services/workspace";
import { skipToken } from "@reduxjs/toolkit/query";
import { Trash2, UserIcon } from "lucide-react";
import { useState } from "react";

interface WorkspaceMembersSettingTabProps {
  workspace: Workspace | null;
}

export const WorkspaceMembersSettingTab = ({
  workspace,
}: WorkspaceMembersSettingTabProps) => {
  const { data: members = [], refetch } = useGetWorkspaceMembersQuery(
    workspace && workspace.id
      ? {
          params: {
            workspaceId: workspace?.id,
          },
        }
      : skipToken,
  );

  const [createInvitation, { isLoading: isInviting }] =
    useCreateInvitationMutation();
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInviteUser = () => {
    const inviteLink = `${window.location.origin}/register`;
    const message = `🎉 به کی‌بوم خوش آمدید!

شما به فضای کاری «${workspace?.name}» دعوت کرده است.

برای پیوستن به این فضای کاری و مدیریت اشتراک‌های تیم، روی لینک زیر کلیک کنید:

${inviteLink}

کی‌بوم: مدیریت هوشمند اشتراک‌های تیم‌ها و سازمان‌ها

---
`;

    navigator.clipboard.writeText(message);
    toast.success(
      "متن دعوت کپی شد",
      "می‌توانید آن را برای کاربر مورد نظر ارسال کنید",
    );
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    if (!workspace) return;

    try {
      const invition = await createInvitation({
        payload: { email: inviteEmail, workspaceId: workspace?.id },
      }).unwrap();

      if (invition?.error && Object.keys(invition?.error).length) {
        const code = invition?.error.code;

        switch (code) {
          case "ALREADY_INVITE":
            toast.error("درخواست دعوت از قبل برای این کاربر ارسال شده است");
            break;
          case "ALREADY_IN_WORKSPACE":
            toast.error("این کاربر از قبل در این فضای کاری حضور دارد");
            break;
          case "USER_NOT_FOUND":
            toast.error("همچین کاربری وجود ندارد", {
              action: {
                label: "دعوت از کاربر",
                onClick: handleInviteUser,
              },
            });
            break;
          default:
            toast.error("خطای نامشخص - لطفا به پشتیبان مراجعه کنید");
            break;
        }
        return;
      } else {
        toast.success(
          "دعوت نامه ارسال شد",
          `دعوت نامه برای ${inviteEmail} ارسال شد`,
        );
      }

      setInviteEmail("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("خطا در ارسال دعوت نامه");
    }
  };

  const handleRemoveMember = (memberId: string) => {
    console.log("Remove member", memberId);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/30 rounded-xl p-4">
        <h4 className="text-white text-sm font-medium mb-3">دعوت عضو جدید</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="ایمیل"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
            containerClassName="flex-1"
          />
          <Button onClick={handleInvite} loading={isInviting}>
            دعوت
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {members?.length ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-800/30 rounded-xl gap-3"
            >
              <div>
                <p className="text-white text-sm font-medium">{member.name}</p>
                <p className="text-gray-500 text-xs">{member.email}</p>
                <p className="text-gray-600 text-xs mt-1">
                  عضو از {new Date(member.joinedAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {member.role !== "owner" && (
                  <>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size="17" />
                    </button>
                  </>
                )}
                {member.role === "owner" && (
                  <span className=" text-amber-400 text-sm">مالک</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={UserIcon}
            title={"فرد دیگری جز شما در این فضای کاری وجود ندارد"}
          />
        )}
      </div>
    </div>
  );
};
