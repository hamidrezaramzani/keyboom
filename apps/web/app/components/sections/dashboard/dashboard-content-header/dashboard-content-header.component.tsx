import { Card } from "@/app/components/ui";
import { LucideIcon } from "lucide-react";

interface DashboardContentHeaderProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const DashboardContentHeader = ({
  title,
  description,
  Icon,
}: DashboardContentHeaderProps) => {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icon className="text-primary-400" size={22} />
            {title}
          </h1>

          <p className="text-gray-400 mt-2">{description}</p>
        </div>
      </div>
    </Card>
  );
};
