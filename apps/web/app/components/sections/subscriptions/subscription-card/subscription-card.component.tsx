"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  ChartArea,
  DollarSign,
  Edit,
  MoreVertical,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  Badge,
  CancelSubscriptionModal,
  Modal,
  RenewSubscriptionModal,
} from "@/app/components";
import { cn } from "@/app/lib/utils";
import { useState, useRef, useEffect } from "react";
import { GroupSubscription } from "@/app/services/group";
import { SubscriptionPeriodFormModal } from "../subscription-period-form/subscription-period-form.component";
import { useRouter } from "next/navigation";
import { SubscriptionForm } from "../subscription-form/subscription-form.component";
import { useUpdateSubscriptionSubmit } from "../subscription-form/subscription-form.hook";

interface SubscriptionCardProps {
  subscription: GroupSubscription;
  onClick: () => void;
  onPriceChange?: () => void;
  workspaceId?: string;
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
  workspaceId,
}: SubscriptionCardProps) => {
  const { push } = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onToggleEditModal = () => {
    setIsEditModalOpen((prevState) => !prevState);
  };

  const { onSubmit } = useUpdateSubscriptionSubmit({
    closeSafeModal: onToggleEditModal,
    subscription,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [
    isAddSubscriptionPeriodModalOpen,
    setIsAddSubscriptionPeriodModalOpen,
  ] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
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
    if (action === "cancel") onToggleCancelModal();
    if (action === "price-change") onToggleAddSubscriptionPeriodModal();
  };

  const onToggleRenewModal = () => {
    setIsRenewModalOpen((prevState) => !prevState);
  };

  const onToggleCancelModal = () => {
    setIsCancelModalOpen((prevState) => !prevState);
  };

  const onToggleAddSubscriptionPeriodModal = () => {
    setIsAddSubscriptionPeriodModalOpen((prevState) => !prevState);
  };

  return (
    <>
      <RenewSubscriptionModal
        isOpen={isRenewModalOpen}
        onClose={onToggleRenewModal}
        subscription={subscription}
      />
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={onToggleCancelModal}
        subscription={subscription}
      />
      <SubscriptionPeriodFormModal
        isOpen={isAddSubscriptionPeriodModalOpen}
        onClose={onToggleAddSubscriptionPeriodModal}
        subscriptionId={subscription.id}
        subscriptionStartDate={subscription.startDate}
        subscriptionEndDate={subscription.endDate}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={onToggleEditModal}
        title={subscription.name}
        size="lg"
      >
        <SubscriptionForm
          initialValues={{
            ...subscription,
            price: subscription.price.toString(),
            startDate: new Date(subscription.startDate),
            endDate: new Date(subscription.endDate),
            groupId: subscription.group.id,
            categoryId: subscription.category.id,
            website: subscription.website || "",
            description: subscription.description || "",
            reminderDays: subscription.reminderDays || 3,
          }}
          onClose={onToggleEditModal}
          isEditing
          onSubmit={onSubmit}
          workspaceId={workspaceId}
        />
      </Modal>

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
                    onToggleEditModal();
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 justify-start cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>ویرایش</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("renew");
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 justify-start cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تمدید</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("price-change");
                  }}
                  className="w-full  px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 justify-start cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>تغییر قیمت</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    push(`/dashboard/subscriptions/stats/${subscription.id}`);
                  }}
                  className="w-full  px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2 justify-start cursor-pointer"
                >
                  <ChartArea className="w-4 h-4" />
                  <span>اطلاعات آماری</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("cancel");
                  }}
                  className="w-full text-right px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2 justify-start cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>لغو اشتراک</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
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
