"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, MoreVertical } from "lucide-react";
import { Badge, RenewSubscriptionModal } from "@/app/components";
import { cn } from "@/app/lib/utils";
import { Subscription } from "@/app/services/subscription";
import { useState, useRef, useEffect } from "react";

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: () => void;
  onRenew?: () => void;
  onCancel?: () => void;
  onPriceChange?: () => void;
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
  onCancel,
  onPriceChange,
}: SubscriptionCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: subscription.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const status =
    statusConfig[subscription.status as "active" | "expiring" | "expired"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false);
    if (action === "renew") onToggleRenewModal();
    if (action === "cancel" && onCancel) onCancel();
    if (action === "price-change" && onPriceChange) onPriceChange();
  };

  const onToggleRenewModal = () => {
    setIsRenewModalOpen((prevState) => !prevState);
  };

  return (
    <>
      <RenewSubscriptionModal
        isOpen={isRenewModalOpen}
        onClose={onToggleRenewModal}
        subscription={subscription}
      />
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-gray-900/80 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-indigo-500/50 transition-all relative",
          isDragging && "opacity-50 shadow-lg",
        )}
        onClick={onClick}
      >
        <div className="absolute left-2 top-2 z-10">
          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 top-full mt-1 w-36 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-50 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("renew");
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  🔄 تمدید
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("price-change");
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  💰 تغییر قیمت
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("cancel");
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  🚫 لغو اشتراک
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 pr-8">
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate flex gap-2">
              {subscription.name}

              <p className="text-gray-400 text-xs font-medium shrink-0">
                {formatPrice(subscription.price)}
              </p>
            </p>
            <div className="flex items-center gap-2 mt-1 pt-3">
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
      </div>
    </>
  );
};
