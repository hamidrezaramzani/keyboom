"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
