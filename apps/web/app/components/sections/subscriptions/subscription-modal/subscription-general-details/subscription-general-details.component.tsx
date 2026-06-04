/* eslint-disable react-hooks/rules-of-hooks */
import { GroupSubscription } from "@/app/services/group";
import { useState } from "react";
import { SubscriptionForm } from "../../subscription-form/subscription-form.component";
import { Badge, Button } from "@/app/components/ui";
import { Calendar, LinkIcon } from "lucide-react";
import { useUpdateSubscriptionSubmit } from "../../subscription-form/subscription-form.hook";

interface SubscriptionGeneralDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: GroupSubscription;
  workspaceId?: string;
  onSuccess?: () => void;
}

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  expiring: { label: "در شرف اتمام", variant: "warning" as const },
  expired: { label: "منقضی", variant: "danger" as const },
};

export const SubscriptionGeneralDetails = ({
  onClose,
  subscription,
  workspaceId,
  onSuccess,
}: SubscriptionGeneralDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const closeSafeModal = () => {
    setIsEditing(false);
    onSuccess?.();
    onClose();
  };

  if (!subscription) return null;

  const { onSubmit } = useUpdateSubscriptionSubmit({
    closeSafeModal,
  });

  const getStatusBadge = () => {
    if (!subscription) return null;
    const config =
      statusConfig[subscription.status as "active" | "expiring" | "expired"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isEditing) {
    return (
      <>
        <div className="space-y-4">
          <div className="grid grid-cols-3">
            <div>
              <p className="text-gray-500 text-sm">عنوان</p>
              <p className="text-white">{subscription.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">دسته‌بندی</p>
              <p className="text-white">{subscription.category.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">گروه</p>
              <p className="text-white">{subscription.group.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">هزینه ماهانه</p>
              <p className="text-white text-lg font-semibold">
                {subscription?.price.toLocaleString("fa-IR")} تومان
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">وضعیت</p>
              {getStatusBadge()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> تاریخ شروع
              </p>
              <p className="text-white">
                {new Date(subscription.startDate).toLocaleDateString("fa-IR")}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> تاریخ پایان
              </p>
              <p className="text-white">
                {new Date(subscription.endDate).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> یادآوری تمدید
              </p>
              <p className="text-white">{subscription.reminderDays} روز</p>
            </div>
          </div>

          {subscription.website && (
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> لینک وب‌سایت
              </p>
              <a
                href={subscription.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline text-sm"
              >
                {subscription.website}
              </a>
            </div>
          )}

          {subscription.description && (
            <div>
              <p className="text-gray-500 text-sm">توضیحات</p>
              <p className="text-gray-300 text-sm">
                {subscription.description}
              </p>
            </div>
          )}

          {subscription.status === "expiring" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <p className="text-amber-400 text-sm">
                ⏰ این اشتراک به زودی منقضی می‌شود. برای تمدید اقدام کنید.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 flex-wrap">
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              ویرایش
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
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
      onClose={closeSafeModal}
      isEditing
      onSubmit={onSubmit}
      workspaceId={workspaceId}
    />
  );
};
