import { Card } from "@/app/components/ui";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardContentHeaderProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const DashboardContentHeader = ({
  title,
  description,
  Icon,
  actions,
}: DashboardContentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Icon className="text-primary-400" size={35} />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {title}
          </h1>
          <p className="text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <div>{actions}</div>
    </div>
  );
};
