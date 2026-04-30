// app/components/ui/Badge.tsx
"use client";

import { cn } from "@/app/lib/utils";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "secondary";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  primary: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  secondary: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-xs rounded",
  md: "px-2 py-0.5 text-sm rounded-md",
};

export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
