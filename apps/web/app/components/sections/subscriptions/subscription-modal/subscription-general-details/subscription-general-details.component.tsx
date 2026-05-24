import { useConfirm } from "@/app/lib/store/context";
import { GroupSubscription } from "@/app/services/group";
import {
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/app/services/subscription";
import { useState } from "react";
import {
  SubscriptionForm,
  SubscriptionFormValues,
} from "../../subscription-form/subscription-form.component";
import { toast } from "@/app/lib";
import { Badge, Button, Modal } from "@/app/components/ui";
import { Calendar, LinkIcon } from "lucide-react";

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
  const { confirm } = useConfirm();

  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] =
    useDeleteSubscriptionMutation();

  const closeSafeModal = () => {
    setIsEditing(false);
    onSuccess?.();
    onClose();
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    if (!subscription) return;

    try {
      await updateSubscription({
        params: { subscriptionId: subscription.id },
        payload: {
          name: data.name,
          price: parseInt(data.price),
          categoryId: data.categoryId,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          website: data.website || null,
          description: data.description || null,
          reminderDays: data.reminderDays,
        },
      }).unwrap();
      toast.success("اشتراک با موفقیت ویرایش شد");
      closeSafeModal();
    } catch (error) {
      toast.error("خطا در ویرایش اشتراک");
      console.error("Update subscription error:", error);
    }
  };

  const handleDelete = async () => {
    if (!subscription) return;

    const confirmed = await confirm({
      title: "حذف اشتراک",
      description: `آیا از حذف اشتراک "${subscription.name}" مطمئن هستید؟ این عمل غیرقابل بازگشت است.`,
      confirmText: "حذف",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await deleteSubscription({
        params: { subscriptionId: subscription.id },
      }).unwrap();
      toast.success("اشتراک با موفقیت حذف شد");
      closeSafeModal();
    } catch (error) {
      toast.error("خطا در حذف اشتراک");
      console.error("Delete subscription error:", error);
    }
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    const config =
      statusConfig[subscription.status as "active" | "expiring" | "expired"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!subscription) return null;

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
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              حذف
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
