import { LucideIcon } from "lucide-react";

export type FeatureColor = "indigo" | "emerald" | "amber";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: FeatureColor;
}
