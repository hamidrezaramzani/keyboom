"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  SubscriptionPeriod,
  useCreatePeriodMutation,
  useGetPeriodsQuery,
  useUpdatePeriodMutation,
} from "@/app/services/subscription-period";
import { toast } from "@/app/lib";

const getPeriodSchema = (
  isEditing: boolean,
  periods?: SubscriptionPeriod[],
  period?: SubscriptionPeriod | null,
) =>
  z
    .object({
      title: z.string().min(1, "عنوان الزامی است"),
      startDate: z.date(),
      endDate: z.date(),
      monthlyPrice: z.string().min(1, "قیمت باید بیشتر از 0 باشد"),
    })
    .superRefine((data, ctx) => {
      if (data.startDate >= data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
          path: ["endDate"],
        });
      }

      const hasOverlap = periods?.some((p) => {
        if (isEditing && p.id === period?.id) return false;

        const existingStart = new Date(p.startDate);
        const existingEnd = new Date(p.endDate);
        const newStart = new Date(data.startDate);
        const newEnd = new Date(data.endDate);

        if (newStart >= existingStart && newStart < existingEnd) return true;
        if (newEnd > existingStart && newEnd <= existingEnd) return true;
        if (newStart <= existingStart && newEnd >= existingEnd) return true;

        return false;
      });

      if (hasOverlap) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "این بازه با یکی از بازه‌های موجود تداخل دارد",
          path: ["startDate"],
        });
      }
    });

type PeriodFormValues = z.infer<ReturnType<typeof getPeriodSchema>>;

interface PricePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  period?: SubscriptionPeriod | null;
  onSuccess?: () => void;
}

export const SubscriptionPeriodFormModal = ({
  isOpen,
  onClose,
  subscriptionId,
  subscriptionStartDate,
  subscriptionEndDate,
  period,
  onSuccess,
}: PricePeriodModalProps) => {
  const [createPeriod, { isLoading: isCreating }] = useCreatePeriodMutation();
  const [updatePeriod, { isLoading: isUpdating }] = useUpdatePeriodMutation();
  const { data: periods } = useGetPeriodsQuery({ params: { subscriptionId } });
  const isEditing = !!period;

  const periodSchema = getPeriodSchema(isEditing, periods, period);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    register,
  } = useForm<PeriodFormValues>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      monthlyPrice: "0",
    },
  });

  useEffect(() => {
    if (period) {
      setValue("title", period.title);
      setValue("startDate", new Date(period.startDate));
      setValue("endDate", new Date(period.endDate));
      setValue("monthlyPrice", period.monthlyPrice.toString());
    } else {
      reset({
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        monthlyPrice: "0",
      });
    }
  }, [period, setValue, reset]);

  const onSubmit = async (data: PeriodFormValues) => {
    try {
      if (isEditing && period) {
        await updatePeriod({
          params: { periodId: period.id, subscriptionId },
          payload: {
            title: data.title,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            monthlyPrice: Number(data.monthlyPrice),
          },
        }).unwrap();
        toast.success("بازه قیمتی با موفقیت ویرایش شد");
      } else {
        await createPeriod({
          params: { subscriptionId },
          payload: {
            title: data.title,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            monthlyPrice: Number(data.monthlyPrice),
          },
        }).unwrap();
        toast.success("بازه قیمتی با موفقیت اضافه شد");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? "خطا در ویرایش بازه قیمتی" : "خطا در اضافه کردن بازه قیمتی",
      );
      console.error("Period error:", error);
    }
  };

  const minStartDate = subscriptionStartDate;
  const maxEndDate = subscriptionEndDate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "ویرایش بازه قیمتی" : "افزودن بازه قیمتی جدید"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="price"
          label="عنوان"
          placeholder="مثال: تخفیف نوروزی، افزایش قیمت"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => {
                    if (date && date.isValid) {
                      field.onChange(date.toDate());
                    }
                  }}
                  minDate={minStartDate}
                  maxDate={maxEndDate}
                  calendarPosition="top-right"
                  calendar={persian}
                  locale={persian_fa}
                  render={
                    <Input
                      type="text"
                      label="تاریخ شروع"
                      placeholder="انتخاب تاریخ"
                    />
                  }
                  containerClassName="w-full"
                />
              )}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => {
                    if (date && date.isValid) {
                      field.onChange(date.toDate());
                    }
                  }}
                  minDate={minStartDate}
                  maxDate={maxEndDate}
                  calendarPosition="top-right"
                  calendar={persian}
                  locale={persian_fa}
                  render={
                    <Input
                      type="text"
                      label="تاریخ پایان"
                      placeholder="انتخاب تاریخ"
                    />
                  }
                  containerClassName="w-full"
                />
              )}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <Input
          label="قیمت ماهانه (تومان)"
          type="number"
          placeholder="۵۹۰۰۰"
          error={errors.monthlyPrice?.message}
          {...register("monthlyPrice")}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || isCreating || isUpdating}
          >
            {isEditing ? "ویرایش بازه" : "افزودن بازه"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
