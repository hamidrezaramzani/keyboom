"use client";

import { Card, EmptyState } from "@/app/components";
import { Check, X, Clock, UserSearchIcon } from "lucide-react";
import moment from "jalali-moment";
import {
  useGetMyInvitesQuery,
  useRespondInvitationMutation,
} from "@/app/services/invite";

const roleLabels = {
  admin: "مدیر",
  member: "عضو",
};

const formatDate = (date: string | Date) => {
  return moment(date).locale("fa").format("HH:mm - YYYY/MM/DD");
};

export const InboxTab = () => {
  const { data } = useGetMyInvitesQuery();
  const [respondInvitation, { isLoading: isResponding }] =
    useRespondInvitationMutation();

  const handleAccept = async (id: string) => {
    try {
      await respondInvitation({
        params: { id },
        payload: { accept: true },
      }).unwrap();
    } catch (error) {
      console.error("Accept failed:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await respondInvitation({
        params: { id },
        payload: { accept: false },
      }).unwrap();
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  const pendingInvitations = data?.pending || [];
  const historyInvitations = data?.history || [];

  if (!pendingInvitations.length && !historyInvitations.length) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">هیچ دعوتی وجود ندارد</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {pendingInvitations.length > 0 ? (
        <Card>
          <h3 className="text-white font-semibold mb-4">دعوت‌های جدید</h3>
          <div className="space-y-4">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/30 rounded-xl gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {inv.workspaceName}
                    </p>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                      {roleLabels[inv.role as "admin" | "member"]}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    دعوت کننده: {inv.inviterName} ({inv.inviterEmail})
                  </p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(inv.invitedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(inv.id)}
                    disabled={isResponding}
                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(inv.id)}
                    disabled={isResponding}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={UserSearchIcon}
            title={"هیچ دعوت جدیدی وجود ندارد"}
          />
        </Card>
      )}

      {historyInvitations.length > 0 ? (
        <Card>
          <h3 className="text-white font-semibold mb-4">سابقه دعوت‌ها</h3>
          <div className="space-y-3">
            {historyInvitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-800/20 rounded-xl gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm">{inv.workspaceName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                      {roleLabels[inv.role as "admin" | "member"]}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {inv.status === "accepted" ? "پذیرفته شده" : "رد شده"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    دعوت کننده: {inv.inviterName}
                  </p>
                </div>
                <p className="text-gray-600 text-xs">
                  {formatDate(inv.respondedAt || inv.invitedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={UserSearchIcon}
            title={"هیچ سابقه دعوتی وجود ندارد"}
          />
        </Card>
      )}
    </div>
  );
};
