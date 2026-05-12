"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import {
  Subscription,
  useCancelSubscriptionMutation,
} from "@/app/services/subscription";
import { toast } from "@/app/lib";

const cancelSchema = z.object({
  title: z.string().min(1, "عنوان لغو الزامی است"),
});

type CancelForm = z.infer<typeof cancelSchema>;

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSuccess?: () => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fa-IR");
};

export const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: CancelSubscriptionModalProps) => {
  const [cancelSubscription, { isLoading }] = useCancelSubscriptionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelForm>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CancelForm) => {
    if (!subscription) return;

    try {
      await cancelSubscription({
        params: { subscriptionId: subscription.id },
        payload: { title: data.title },
      }).unwrap();
      toast.success("اشتراک با موفقیت لغو شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در لغو اشتراک");
      console.error("Cancel error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="لغو اشتراک" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="عنوان لغو"
          placeholder="مثال: دیگر نیاز نداریم، گران است"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium mb-2">
            ⚠️ هشدار: این عمل غیرقابل بازگشت است
          </p>
          <p className="text-gray-400 text-xs">اشتراک: {subscription?.name}</p>
          <p className="text-gray-400 text-xs mt-1">
            تاریخ پایان فعلی:{" "}
            {subscription?.endDate ? formatDate(subscription.endDate) : "-"}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="danger" loading={isLoading}>
            لغو اشتراک
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
