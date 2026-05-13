// app/components/ui/Tooltip.tsx
"use client";

import { useState, useRef, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 300,
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap",
            positionClasses[position],
            className,
          )}
        >
          {content}
          <div
            className={cn("absolute w-0 h-0 border-4", arrowClasses[position])}
          />
        </div>
      )}
    </div>
  );
};
