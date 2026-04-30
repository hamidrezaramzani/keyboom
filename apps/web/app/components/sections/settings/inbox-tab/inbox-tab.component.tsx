// app/components/sections/settings/InboxTab.tsx
"use client";

import { useState } from "react";
import { Card, Button } from "@/app/components";
import { Check, X, Clock } from "lucide-react";

interface Invitation {
  id: string;
  workspaceName: string;
  inviterName: string;
  inviterEmail: string;
  role: "admin" | "member";
  invitedAt: string;
  status: "pending" | "accepted" | "rejected";
}

const mockInvitations: Invitation[] = [
  {
    id: "1",
    workspaceName: "شرکت دیجی‌کالا",
    inviterName: "محمد رضایی",
    inviterEmail: "mohammad@digikala.com",
    role: "admin",
    invitedAt: "۱۴۰۳/۱۰/۱۵",
    status: "pending",
  },
  {
    id: "2",
    workspaceName: "آژانس سفر آرمان",
    inviterName: "سارا کریمی",
    inviterEmail: "sara@arman.com",
    role: "member",
    invitedAt: "۱۴۰۳/۱۰/۱۰",
    status: "pending",
  },
  {
    id: "3",
    workspaceName: "استارتاپ بوم",
    inviterName: "علی نادری",
    inviterEmail: "ali@boom.ir",
    role: "admin",
    invitedAt: "۱۴۰۳/۰۹/۲۵",
    status: "accepted",
  },
];

export const InboxTab = () => {
  const [invitations, setInvitations] = useState(mockInvitations);

  const handleAccept = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setInvitations(
      invitations.map((inv) =>
        inv.id === id ? { ...inv, status: "accepted" } : inv,
      ),
    );
    console.log("Accept invitation:", id);
  };

  const handleReject = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setInvitations(
      invitations.map((inv) =>
        inv.id === id ? { ...inv, status: "rejected" } : inv,
      ),
    );
    console.log("Reject invitation:", id);
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending",
  );
  const otherInvitations = invitations.filter(
    (inv) => inv.status !== "pending",
  );

  const roleLabels = {
    admin: "مدیر",
    member: "عضو",
  };

  return (
    <div className="space-y-6">
      {pendingInvitations.length > 0 && (
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
                      {roleLabels[inv.role]}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    دعوت کننده: {inv.inviterName} ({inv.inviterEmail})
                  </p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {inv.invitedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(inv.id)}
                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(inv.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {otherInvitations.length > 0 && (
        <Card>
          <h3 className="text-white font-semibold mb-4">سابقه دعوت‌ها</h3>
          <div className="space-y-3">
            {otherInvitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-800/20 rounded-xl gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm">{inv.workspaceName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                      {roleLabels[inv.role]}
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
                <p className="text-gray-600 text-xs">{inv.invitedAt}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {invitations.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">هیچ دعوتی وجود ندارد</p>
          </div>
        </Card>
      )}
    </div>
  );
};
