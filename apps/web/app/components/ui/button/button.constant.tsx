import { ButtonSize, ButtonVariant } from "./button.type";

export const variants: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
  secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
  outline: "border border-gray-700 text-gray-300 hover:bg-gray-800",
  ghost: "text-gray-300 hover:text-white",
};

export const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};
