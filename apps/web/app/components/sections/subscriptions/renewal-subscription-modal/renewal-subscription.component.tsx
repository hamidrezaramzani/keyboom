"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useRenewSubscriptionMutation } from "@/app/services/subscription";
import { toast } from "@/app/lib";
import { GroupSubscription } from "@/app/services/group";

const renewSchema = z.object({
  title: z.string().min(1, "عنوان تمدید الزامی است"),
  renewDate: z.date().min(new Date(), "تاریخ تمدید الزامی است"),
});

type RenewForm = z.infer<typeof renewSchema>;

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: GroupSubscription;
  onSuccess?: () => void;
}

export const RenewSubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: RenewSubscriptionModalProps) => {
  const [renewSubscription, { isLoading }] = useRenewSubscriptionMutation();

  const getMinDate = () => {
    const date = new Date(subscription.endDate);
    date.setDate(date.getDate() + 1);
    return date;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RenewForm>({
    resolver: zodResolver(renewSchema),
    defaultValues: {
      title: "",
      renewDate: getMinDate(),
    },
  });

  const onSubmit = async (data: RenewForm) => {
    try {
      await renewSubscription({
        params: { subscriptionId: subscription.id },
        payload: {
          title: data.title,
          renewDate: data.renewDate.toISOString(),
        },
      }).unwrap();
      toast.success("اشتراک با موفقیت تمدید شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در تمدید اشتراک");
      console.error("Renew error:", error);
    }
  };

  const MIN_DATE = getMinDate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تمدید اشتراک" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="عنوان تمدید"
          placeholder="مثال: تمدید عادی، تمدید با تخفیف"
          error={errors.title?.message}
          {...register("title")}
        />

        <Controller
          control={control}
          name="renewDate"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(date) => {
                if (date && date.isValid) {
                  field.onChange(date.toDate());
                }
              }}
              calendarPosition="bottom-right"
              calendar={persian}
              locale={persian_fa}
              minDate={MIN_DATE}
              render={
                <Input
                  type="text"
                  label="تاریخ تمدید"
                  placeholder="انتخاب تاریخ"
                />
              }
              containerClassName="w-full"
            />
          )}
        />
        {errors.renewDate && (
          <p className="text-red-500 text-sm">{errors.renewDate.message}</p>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isLoading}>
            تمدید اشتراک
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
