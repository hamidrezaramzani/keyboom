"use client";

import { Button, EmptyState, Input } from "@/app/components/ui";
import { toast } from "@/app/lib";
import { useCreateInvitationMutation } from "@/app/services/invite/api-invite.endpoint";
import { useGetWorkspaceMembersQuery } from "@/app/services/workspace";
import { UserIcon } from "lucide-react";
import { useState } from "react";

interface WorkspaceMembersSettingTabProps {
  workspaceId: string;
}

export const WorkspaceMembersSettingTab = ({
  workspaceId,
}: WorkspaceMembersSettingTabProps) => {
  const { data: membersData, refetch } = useGetWorkspaceMembersQuery({
    params: {
      workspaceId,
    },
  });

  const [createInvitation, { isLoading: isInviting }] =
    useCreateInvitationMutation();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");

  const members = membersData?.data || [];

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      const invition = await createInvitation({
        email: inviteEmail,
        workspaceId,
        role: inviteRole,
      }).unwrap();

      if (invition?.data.error && Object.keys(invition?.data?.error).length) {
        const code = invition?.data.error.code;

        switch (code) {
          case "ALREADY_INVITE":
            toast.error("درخواست دعوت از قبل برای این کاربر ارسال شده است");
            break;
          case "ALREADY_IN_WORKSPACE":
            toast.error("این کاربر از قبل در این فضای کاری حضور دارد");
            break;
          case "USER_NOT_FOUND":
            toast.error("همچین کاربری وجود ندارد");
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

  const handleChangeRole = (memberId: string, newRole: "admin" | "member") => {
    console.log("Change role", memberId, newRole);
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
