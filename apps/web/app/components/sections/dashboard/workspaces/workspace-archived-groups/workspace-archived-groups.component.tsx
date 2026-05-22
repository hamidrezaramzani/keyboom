"use client";
import { Group, useRestoreGroupMutation } from "@/app/services/group";
import { Archive, RefreshCw, Package } from "lucide-react";
import { Card, Badge } from "@/app/components";
import { useState } from "react";

interface WorkspaceArchivedGroupsProps {
  groups: Group[];
  onRestore?: () => void;
}

export const WorkspaceArchivedGroups = ({
  groups,
  onRestore,
}: WorkspaceArchivedGroupsProps) => {
  const [restore] = useRestoreGroupMutation();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (!groups || groups.length === 0) {
    return (
      <Card variant="default">
        <div className="text-center py-8">
          <Archive className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">هیچ گروه آرشیو شده‌ای وجود ندارد</p>
          <p className="text-gray-600 text-sm mt-1">
            گروه‌هایی که بایگانی می‌کنید در این قسمت نمایش داده می‌شوند
          </p>
        </div>
      </Card>
    );
  }

  const handleRestore = async (groupId: string) => {
    try {
      setRestoringId(groupId);
      await restore({ params: { groupId } });
      onRestore?.();
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-3 px-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Archive size={18} className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-400">
            گروه‌های آرشیو شده
          </h3>
        </div>
        <Badge variant="secondary" size="sm">
          {groups.length} گروه
        </Badge>
      </div>

      <div className="space-y-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                <Package size={18} className="text-gray-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-200">
                    {group.name}
                  </p>
                  <Badge variant="secondary" size="sm">
                    آرشیو شده
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  تاریخ آرشیو:{" "}
                  {new Date(group.updatedAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleRestore(group.id)}
              disabled={restoringId === group.id}
              className="p-2 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="بازیابی گروه"
            >
              <RefreshCw
                size={16}
                className={restoringId === group.id ? "animate-spin" : ""}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
