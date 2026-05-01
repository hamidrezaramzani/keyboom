"use client";
import { toast as toastLib } from "sonner";

export const toast = {
  success: (message: string, description?: string) => {
    toastLib.success(message, {
      description,
      className:
        "!bg-white/10 !backdrop-blur-xl !border !border-white/20 !shadow-xl !rounded-2xl",
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        fontFamily: "Vazirmatn",
      },
    });
  },

  error: (message: string, description?: string) => {
    toastLib.error(message, {
      description,
      className:
        "!bg-red-500/10 !backdrop-blur-xl !border !border-red-500/20 !shadow-xl !rounded-2xl",
      style: {
        color: "white",
        fontFamily: "Vazirmatn",
      },
    });
  },

  warning: (message: string, description?: string) => {
    toastLib.warning(message, {
      description,
      className:
        "!bg-amber-500/10 !backdrop-blur-xl !border !border-amber-500/20 !shadow-xl !rounded-2xl",
      style: {
        color: "white",
        fontFamily: "Vazirmatn",
      },
    });
  },

  info: (message: string, description?: string) => {
    toastLib.info(message, {
      description,
      className:
        "!bg-blue-500/10 !backdrop-blur-xl !border !border-blue-500/20 !shadow-xl !rounded-2xl",
      style: {
        color: "white",
        fontFamily: "Vazirmatn",
      },
    });
  },
};
