"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

export type AlertDialogVariant = "success" | "error" | "warning" | "info";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  variant?: AlertDialogVariant;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  autoClose?: number; // milliseconds, 0 = no auto close
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-400",
    buttonColor: "bg-green-600 hover:bg-green-700",
    borderColor: "border-green-500/30",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-400",
    buttonColor: "bg-red-600 hover:bg-red-700",
    borderColor: "border-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    borderColor: "border-yellow-500/30",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    borderColor: "border-blue-500/30",
  },
};

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = "info",
  confirmText = "تأیید",
  cancelText = "انصراف",
  showCancel = true,
  autoClose = 0,
}: AlertDialogProps) {
  const [mounted, setMounted] = useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!mounted || !isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* dialog */}
      <div
        className={`relative bg-gray-900 rounded-2xl border ${config.borderColor} shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200`}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Icon size={22} className={config.iconColor} />
            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <div className="p-4">
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg ${config.buttonColor} text-white transition-colors text-sm font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function useAlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [props, setProps] = useState<
    Omit<AlertDialogProps, "isOpen" | "onClose">
  >({
    title: "",
    message: "",
    variant: "info",
  });

  const showAlert = (
    newProps: Omit<AlertDialogProps, "isOpen" | "onClose">,
  ) => {
    setProps(newProps);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  const AlertDialogComponent = (
    <AlertDialog isOpen={isOpen} onClose={closeAlert} {...props} />
  );

  return { showAlert, closeAlert, AlertDialogComponent };
}
