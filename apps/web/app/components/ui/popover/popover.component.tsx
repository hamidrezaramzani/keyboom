"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  position?:
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right"
    | "left"
    | "right";
  width?: number | string;
  offset?: number;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Popover = ({
  trigger,
  content,
  position = "bottom-left",
  width = 320,
  offset = 8,
  className = "",
  contentClassName = "",
  disabled = false,
  onOpenChange,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    const positions = {
      "bottom-left": "left-0 top-full",
      "bottom-right": "right-0 top-full",
      "top-left": "left-0 bottom-full",
      "top-right": "right-0 bottom-full",
      left: "right-full top-1/2 -translate-y-1/2",
      right: "left-full top-1/2 -translate-y-1/2",
    };
    return positions[position];
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div ref={triggerRef} onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute z-[9999] bg-gray-800 rounded-xl border border-gray-700 shadow-lg",
            getPositionClasses(),
            contentClassName,
          )}
          style={{
            marginTop: position.includes("bottom") ? offset : 0,
            marginBottom: position.includes("top") ? offset : 0,
            marginLeft: position === "right" ? offset : 0,
            marginRight: position === "left" ? offset : 0,
            width: typeof width === "number" ? `${width}px` : width,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
