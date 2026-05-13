"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components";
import { useReadManyCategoriesQuery } from "@/app/services/category";
import { toast } from "@/app/lib";
import { useCreateSubscriptionMutation } from "@/app/services/subscription/api-subscription.endpoint";
import { Group } from "@/app/services/group";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const addSubscriptionSchema = z
  .object({
    name: z.string().min(1, "نام اشتراک الزامی است"),
    categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
    groupId: z.string().min(1, "گروه الزامی است"),
    price: z.string().min(1, "قیمت الزامی است"),
    startDate: z.date().min(new Date(), "تاریخ شروع الزامی است"),
    endDate: z.date().min(new Date(), "تاریخ پایان الزامی است"),
    website: z.string().url("لینک معتبر وارد کنید").or(z.literal("")),
    description: z.string(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "تاریخ پایان باید حداقل یک روز بعد از تاریخ شروع باشد",
        path: ["endDate"],
      });
    }
  });

type AddSubscriptionForm = z.infer<typeof addSubscriptionSchema>;

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  defaultGroupId?: string | null;
  onSuccess?: () => void;
  groups: Group[];
}

export const AddSubscriptionModal = ({
  isOpen,
  onClose,
  defaultGroupId,
  onSuccess,
  groups,
}: AddSubscriptionModalProps) => {
  const { data: categories } = useReadManyCategoriesQuery({});

  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, defaultValues },
    reset,
    control,
  } = useForm<AddSubscriptionForm>({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      groupId: defaultGroupId || "",
      price: "",
      startDate: new Date(),
      endDate: new Date(),
      website: "",
      description: "",
    },
  });

  const onSubmit = async (data: AddSubscriptionForm) => {
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
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در اضافه کردن اشتراک");
      console.error("Create subscription error:", error);
    }
  };

  const categoriesOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const groupsOptions =
    groups?.map((g) => ({
      value: g.id,
      label: g.name,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="اضافه کردن اشتراک جدید"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="نام اشتراک"
          placeholder="مثال: فیلیمو"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="دسته‌بندی"
            options={categoriesOptions}
            error={errors.categoryId?.message}
            {...register("categoryId")}
          />
          <Select
            label="گروه"
            options={groupsOptions}
            defaultValue={defaultGroupId || ""}
            error={errors.groupId?.message}
            {...register("groupId")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input
            label="هزینه ماهانه (تومان)"
            type="number"
            placeholder="۵۹۰۰۰"
            error={errors.price?.message}
            {...register("price")}
          />
        </div>

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
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
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
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <Input
          label="لینک وب‌سایت (اختیاری)"
          placeholder="https://filimo.com"
          error={errors.website?.message}
          {...register("website")}
        />

        <textarea
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="توضیحات (اختیاری)"
          {...register("description")}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || isCreating}
          >
            ذخیره اشتراک
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
