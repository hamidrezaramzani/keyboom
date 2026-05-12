"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical, Settings, Wallet } from "lucide-react";
import { SubscriptionCard } from "../subscription-card/subscription-card.component";
import { Button, EmptyState } from "@/app/components";
import { cn } from "@/app/lib/utils";
import { Group } from "@/app/services/group";
import { Subscription } from "@/app/services/subscription";

interface BoardColumnProps {
  group: Group;
  onSettings: () => void;
  onSubscriptionClick: (subscription: Subscription) => void;
  onAddSubscriptionClick: (groupId: string) => void;
}

export const BoardColumn = ({
  group,
  onSettings,
  onSubscriptionClick,
  onAddSubscriptionClick,
}: BoardColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const subscriptionIds = group.subscriptions.map((sub) => sub.id);

  const expiringSubscriptions = group.subscriptions.filter(
    (sub) => sub.status === "expiring",
  );
  const activeSubscriptions = group.subscriptions.filter(
    (sub) => sub.status === "active",
  );
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-80 bg-gray-800/30 rounded-xl border border-gray-700 flex-shrink-0 flex flex-col min-h-[80vh]",
        isDragging && "opacity-50",
      )}
    >
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <h3 className="text-white font-semibold">{group.name}</h3>
        </div>
        <button
          onClick={onSettings}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <SortableContext
          items={subscriptionIds}
          strategy={verticalListSortingStrategy}
        >
          {expiringSubscriptions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-xs text-amber-400 font-medium">
                  در شرف اتمام
                </span>
              </div>
              <div className="space-y-2">
                {expiringSubscriptions.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onClick={() =>
                      onSubscriptionClick(sub as unknown as Subscription)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {activeSubscriptions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-400 font-medium">
                  فعال
                </span>
              </div>
              <div className="space-y-2">
                {activeSubscriptions.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onClick={() =>
                      onSubscriptionClick(sub as unknown as Subscription)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </SortableContext>

        {group.subscriptions.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            <EmptyState icon={Wallet} title="هیچ اشتراکی در این گروه نیست" />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="text-gray-400 hover:text-white"
          onClick={() => onAddSubscriptionClick(group.id)}
        >
          + اضافه کردن اشتراک
        </Button>
      </div>
    </div>
  );
};
