"use client";

import { Plus } from "lucide-react";

interface AddGroupColumnProps {
  onClick: () => void;
}

export const AddGroupColumn = ({ onClick }: AddGroupColumnProps) => {
  return (
    <div className="w-80 bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-700 flex-shrink-0 flex flex-col items-center justify-center min-h-[400px] transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5">
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-3 p-6 cursor-pointer"
      >
        <div className="p-3 bg-gray-800 rounded-full">
          <Plus className="w-6 h-6 text-indigo-400" />
        </div>
        <span className="text-gray-400 text-sm font-medium">
          افزودن گروه جدید
        </span>
        <span className="text-gray-600 text-xs">
          ستون جدید به بورد اضافه کنید
        </span>
      </button>
    </div>
  );
};
