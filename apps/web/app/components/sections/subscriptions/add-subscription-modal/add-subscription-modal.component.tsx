"use client";

import { Modal } from "@/app/components";
import { toast } from "@/app/lib";
import { useCreateSubscriptionMutation } from "@/app/services/subscription/api-subscription.endpoint";
import {
  SubscriptionForm,
  SubscriptionFormValues,
} from "../subscription-form/subscription-form.component";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  defaultGroupId?: string | null;
  onSuccess?: () => void;
}

export const AddSubscriptionModal = ({
  isOpen,
  onClose,
  onSuccess,
  workspaceId,
}: AddSubscriptionModalProps) => {
  const [createSubscription] = useCreateSubscriptionMutation();

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      await createSubscription({
        payload: {
          name: data.name,
          price: parseInt(data.price),
          categoryId: data.categoryId,
          groupId: data.groupId,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          website: data.website || null,
          description: data.description || null,
          reminderDays: 3,
        },
      }).unwrap();
      toast.success("اشتراک با موفقیت اضافه شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در اضافه کردن اشتراک");
      console.error("Create subscription error:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="اضافه کردن اشتراک جدید"
      size="lg"
    >
      <SubscriptionForm
        workspaceId={workspaceId}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
};
