import { useUpdateSubscriptionMutation } from "@/app/services/subscription";
import { SubscriptionFormValues } from "./subscription-form.component";
import { toast } from "@/app/lib";

type UseUpdateSubscriptionSubmitProps = {
  subscription?: {
    id: string;
  } | null;
  closeSafeModal: () => void;
};

export const useUpdateSubscriptionSubmit = ({
  subscription,
  closeSafeModal,
}: UseUpdateSubscriptionSubmitProps) => {
  const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation();

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

  return {
    onSubmit,
    isLoading,
  };
};
