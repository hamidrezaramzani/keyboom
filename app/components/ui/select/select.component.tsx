"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, containerClassName, className, ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 bg-gray-800/50 border rounded-xl",
            "text-white placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500",
            "transition-all duration-200 appearance-none cursor-pointer",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-700 focus:border-indigo-500",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-800"
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
