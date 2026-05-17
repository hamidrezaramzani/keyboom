import { Card, Badge } from "@/app/components";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  titleBadge?: string;
}

export function SubscriptionReportStatsCard({
  title,
  value,
  icon: Icon,
  color = "text-white",
  titleBadge,
}: StatCardProps) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          {title}
          {titleBadge && (
            <Badge size="sm" variant="success" className="mr-2">
              {titleBadge}
            </Badge>
          )}
        </p>
        {Icon && <Icon size={18} className="text-gray-500" />}
      </div>
      <p className={`text-xl font-bold mt-3 ${color}`}>{value}</p>
    </Card>
  );
}
