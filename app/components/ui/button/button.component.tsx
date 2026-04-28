import { ArrowRight } from "lucide-react";
import { ButtonProps } from "./button.type";
import { sizes, variants } from "./button.constant";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
      {icon && (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
    </button>
  );
};
