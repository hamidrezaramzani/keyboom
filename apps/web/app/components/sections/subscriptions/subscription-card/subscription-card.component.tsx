"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar } from "lucide-react";
import { Badge } from "@/app/components";
import { cn } from "@/app/lib/utils";
import { Subscription } from "@/app/services/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: () => void;
}

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  expiring: { label: "در شرف اتمام", variant: "warning" as const },
  expired: { label: "منقضی", variant: "danger" as const },
};

const formatPrice = (price: number) => {
  return price.toLocaleString("fa-IR") + " تومان";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fa-IR");
};

export const SubscriptionCard = ({
  subscription,
  onClick,
}: SubscriptionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subscription.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const status =
    statusConfig[subscription.status as "active" | "expiring" | "expired"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-gray-900/80 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-indigo-500/50 transition-all",
        isDragging && "opacity-50 shadow-lg",
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {subscription.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
              {subscription.status === "expiring" && (
                <span className="text-amber-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(subscription.endDate as unknown as string)}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-white text-sm font-medium shrink-0 mr-2">
          {formatPrice(subscription.price)}
        </p>
      </div>
    </div>
  );
};
