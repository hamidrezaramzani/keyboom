import { WorkspaceMember } from "@/app/services/workspace";
import { Crown, Mail } from "lucide-react";
import { Avatar, Badge } from "@/app/components";

interface WorkspaceMembersProps {
  members?: WorkspaceMember[];
}

export const WorkspaceMembers = ({ members }: WorkspaceMembersProps) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-medium text-gray-400">اعضای فضای کاری</h3>
        <Badge variant="secondary" size="sm">
          {members.length} نفر
        </Badge>
      </div>

      <div className="space-y-2 px-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  size="md"
                  className="bg-indigo-500/20 text-indigo-400"
                  name={member.name}
                />
                {member.isOwner && (
                  <div className="absolute -top-1 -right-1">
                    <Crown
                      size={14}
                      className="text-yellow-400 fill-yellow-400/20"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-200">
                    {member.name || "کاربر ناشناس"}
                  </p>
                  {member.isOwner && (
                    <Badge variant="warning" size="sm">
                      مالک
                    </Badge>
                  )}
                </div>
                {member.email && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail size={12} className="text-gray-500" />
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
