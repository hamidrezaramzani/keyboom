// components/ui/drawer/drawer.component.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[480px]",
  xl: "w-[640px]",
  full: "w-full",
};

export function Drawer({
  isOpen,
  onClose,
  children,
  position = "right",
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen
            ? "bg-black/70 backdrop-blur-sm visible"
            : "bg-black/0 invisible"
        }`}
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 h-full z-50 bg-gray-900 shadow-xl transition-transform duration-300 ease-out ${
          sizeClasses[size]
        } ${position === "right" ? "right-0" : "left-0"} ${
          isOpen
            ? "translate-x-0"
            : position === "right"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-gray-400 hover:bg-gray-800 transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </>,
    document.body,
  );
}
