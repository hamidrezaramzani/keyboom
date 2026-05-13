"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select, Badge } from "@/app/components";
import { Calendar, Link as LinkIcon } from "lucide-react";
import { useReadManyCategoriesQuery } from "@/app/services/category";
import { useGetGroupsQuery } from "@/app/services/group";
import { useConfirm } from "@/app/lib/store/context";
import {
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/app/services/subscription/api-subscription.endpoint";
import { toast } from "@/app/lib";
import { Subscription } from "@/app/services/subscription";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const editSubscriptionSchema = z
  .object({
    name: z.string().min(1, "نام اشتراک الزامی است"),
    categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
    groupId: z.string().min(1, "گروه الزامی است"),
    price: z.string().min(1, "قیمت الزامی است"),
    startDate: z.date().min(new Date(), "تاریخ شروع الزامی است"),
    endDate: z.date().min(new Date(), "تاریخ پایان الزامی است"),
    website: z.string().url("لینک معتبر وارد کنید").or(z.literal("")),
    description: z.string(),
    reminderDays: z.string(),
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

type EditSubscriptionForm = z.infer<typeof editSubscriptionSchema>;

const reminderOptions = [
  { value: "1", label: "۱ روز قبل" },
  { value: "3", label: "۳ روز قبل" },
  { value: "7", label: "۷ روز قبل" },
  { value: "0", label: "خاموش" },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription;
  workspaceId?: string;
  onSuccess?: () => void;
  groupName?: string;
}

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  expiring: { label: "در شرف اتمام", variant: "warning" as const },
  expired: { label: "منقضی", variant: "danger" as const },
};

export const SubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
  workspaceId,
  onSuccess,
  groupName,
}: SubscriptionModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { confirm } = useConfirm();

  const { data: categories } = useReadManyCategoriesQuery({});
  const { data: groupsData } = useGetGroupsQuery(
    { params: { workspaceId: workspaceId! } },
    { skip: !workspaceId },
  );
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] =
    useDeleteSubscriptionMutation();

  const groups = groupsData || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<EditSubscriptionForm>({
    resolver: zodResolver(editSubscriptionSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      groupId: "",
      price: "",
      startDate: subscription?.startDate
        ? new Date(subscription?.startDate)
        : undefined,
      endDate: subscription?.endDate
        ? new Date(subscription?.endDate)
        : undefined,
      website: "",
      description: "",
      reminderDays: "3",
    },
  });

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name,
        categoryId: subscription.category,
        groupId: subscription.groupId,
        price: subscription.price.toString(),
        startDate: new Date(subscription.startDate),
        endDate: new Date(subscription.endDate),
        website: subscription.website || "",
        description: subscription.description || "",
        reminderDays: subscription?.reminderDays?.toString(),
      });
    }
  }, [subscription, isEditing, reset]);

  const onSubmit = async (data: EditSubscriptionForm) => {
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
          reminderDays: parseInt(data.reminderDays),
        },
      }).unwrap();
      toast.success("اشتراک با موفقیت ویرایش شد");
      setIsEditing(false);
      onSuccess?.();
      onClose();
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
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در حذف اشتراک");
      console.error("Delete subscription error:", error);
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

  const getStatusBadge = () => {
    if (!subscription) return null;
    const config =
      statusConfig[subscription.status as "active" | "expiring" | "expired"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!subscription) return null;

  if (!isEditing) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={subscription.name}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">دسته‌بندی</p>
              <p className="text-white">{subscription.category}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">گروه</p>
              <p className="text-white">{groupName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">هزینه ماهانه</p>
              <p className="text-white text-lg font-semibold">
                {subscription.price.toLocaleString("fa-IR")} تومان
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

          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-500 text-sm mb-2">تنظیمات اعلان</p>
            <p className="text-white">
              یادآوری{" "}
              {reminderOptions.find(
                (o) => o.value === subscription?.reminderDays?.toString(),
              )?.label || "۳ روز قبل"}{" "}
              از اتمام
            </p>
          </div>

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
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ویرایش اشتراک" size="lg">
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
            error={errors.groupId?.message}
            {...register("groupId")}
          />
        </div>

        <Input
          label="هزینه ماهانه (تومان)"
          type="number"
          placeholder="۵۹۰۰۰"
          error={errors.price?.message}
          {...register("price")}
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

        <label className="block text-sm font-medium text-gray-300 mb-2">
          توضیحات
        </label>
        <textarea
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="توضیحات (اختیاری)"
          {...register("description")}
        />

        <Select
          label="یادآوری"
          options={reminderOptions}
          {...register("reminderDays")}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || isUpdating}
          >
            ذخیره تغییرات
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
