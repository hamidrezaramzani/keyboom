import { ReactNode } from "react";

export type CardVariant = "default" | "gradient" | "hover";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}
