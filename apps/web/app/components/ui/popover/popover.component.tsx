"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import { useIsMobile } from "@/app/lib/hooks/use-is-mobile";

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
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (disabled) return;

    const next = !isOpen;

    setIsOpen(next);
    onOpenChange?.(next);
  };

  const close = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!isOpen) return;

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
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const getDesktopPositionClasses = () => {
    const positions = {
      "bottom-left": "md:left-0 md:top-full",
      "bottom-right": "md:right-0 md:top-full",
      "top-left": "md:left-0 md:bottom-full",
      "top-right": "md:right-0 md:bottom-full",
      left: "md:right-full md:top-1/2 md:-translate-y-1/2",
      right: "md:left-full md:top-1/2 md:-translate-y-1/2",
    };

    return positions[position];
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        ref={triggerRef}
        onClick={toggle}
        className={cn(!disabled && "cursor-pointer")}
      >
        {trigger}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/20 md:hidden"
            onClick={close}
          />

          <div
            ref={popoverRef}
            className={cn(
              `
              z-[9999]
              rounded-xl
              border border-gray-700
              bg-gray-800
              shadow-xl
              overflow-x-hidden

              max-md:fixed
              max-md:left-1/2
              max-md:top-[80px]
              max-md:-translate-x-1/2
              max-md:w-[calc(100vw-24px)]
              max-md:max-w-none
              max-md:max-h-[calc(100vh-100px)]

              md:absolute
              md:max-w-[90vw]
              `,
              getDesktopPositionClasses(),
              contentClassName,
            )}
            style={{
              marginTop: position.includes("bottom") ? offset : 0,

              marginBottom: position.includes("top") ? offset : 0,

              marginLeft: position === "right" ? offset : 0,

              marginRight: position === "left" ? offset : 0,

              width: isMobile
                ? "90%"
                : typeof width === "number"
                  ? `${width}px`
                  : width,
            }}
          >
            {content}
          </div>
        </>
      )}
    </div>
  );
};
