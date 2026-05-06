"use client";

import { X } from "lucide-react";
import { Button } from "@/app/components";
import { cn } from "@/app/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "تایید",
  cancelText = "انصراف",
  variant = "danger",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-500",
    warning: "bg-amber-600 hover:bg-amber-500",
    info: "bg-indigo-600 hover:bg-indigo-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200",
              variantStyles[variant],
            )}
          >
            {confirmText}
          </button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
