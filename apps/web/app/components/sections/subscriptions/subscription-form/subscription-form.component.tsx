"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Select } from "@/app/components";
import { useReadManyCategoriesQuery } from "@/app/services/category";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useGetGroupsQuery } from "@/app/services/group";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

const subscriptionSchema = z
  .object({
    name: z.string().min(1, "نام اشتراک الزامی است"),
    categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
    groupId: z.string().min(1, "گروه الزامی است"),
    price: z.string().min(1, "قیمت الزامی است"),
    startDate: z.date(),
    endDate: z.date(),
    reminderDays: z.number().min(0).max(7).default(3),
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

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "تاریخ شروع باید حداقل یک روز قبل از تاریخ پایان باشد",
        path: ["startDate"],
      });
    }
  });

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormValues) => Promise<void>;
  initialValues?: Partial<SubscriptionFormValues>;
  onClose: () => void;
  isEditing?: boolean;
  workspaceId?: string;
  isLoading?: boolean;
}

export const SubscriptionForm = ({
  onSubmit,
  initialValues,
  onClose,
  workspaceId,
  isEditing = false,
  isLoading = false,
}: SubscriptionFormProps) => {
  const { data: categories } = useReadManyCategoriesQuery({});
  const { data: groups } = useGetGroupsQuery(
    workspaceId ? { params: { workspaceId } } : skipToken,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      groupId: "",
      price: "",
      startDate: new Date(),
      endDate: new Date(),
      website: "",
      description: "",
      reminderDays: 3,
    },
  });

  useEffect(() => {
    if (initialValues) {
      if (initialValues.name) setValue("name", initialValues.name);
      if (initialValues.categoryId)
        setValue("categoryId", initialValues.categoryId);
      if (initialValues.groupId) setValue("groupId", initialValues.groupId);
      if (initialValues.price) setValue("price", initialValues.price);
      if (initialValues.startDate)
        setValue("startDate", initialValues.startDate);
      if (initialValues.endDate) setValue("endDate", initialValues.endDate);
      if (initialValues.website) setValue("website", initialValues.website);
      if (initialValues.description)
        setValue("description", initialValues.description);
      if (initialValues.reminderDays)
        setValue("reminderDays", initialValues.reminderDays);
    }
  }, [initialValues, setValue]);

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
  console.log(initialValues, groupsOptions);

  const handleFormSubmit = async (data: SubscriptionFormValues) => {
    await onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                calendarPosition="top-right"
                calendar={persian}
                locale={persian_fa}
                render={
                  <Input
                    type="text"
                    label="تاریخ پایان"
                    placeholder="انتخاب تاریخ"
                    disabled={isEditing}
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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            یادآوری تمدید
          </label>
          <select
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("reminderDays", { valueAsNumber: true })}
          >
            <option value="1">۱ روز قبل</option>
            <option value="2">۲ روز قبل</option>
            <option value="3">۳ روز قبل</option>
            <option value="5">۵ روز قبل</option>
            <option value="7">۷ روز قبل</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            چند روز قبل از اتمام، یادآوری دریافت کنید
          </p>
          {errors.reminderDays && (
            <p className="text-red-500 text-sm mt-1">
              {errors.reminderDays.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting || isLoading}
        >
          {isEditing ? "ویرایش اشتراک" : "ذخیره اشتراک"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
      </div>
    </form>
  );
};
