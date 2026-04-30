"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select, Badge } from "@/app/components";
import { Calendar, Link as LinkIcon } from "lucide-react";

const editSubscriptionSchema = z.object({
  name: z.string().min(1, "نام اشتراک الزامی است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  groupId: z.string(),
  price: z.string().min(1, "قیمت الزامی است"),
  startDate: z.string().min(1, "تاریخ شروع الزامی است"),
  endDate: z.string().min(1, "تاریخ پایان الزامی است"),
  website: z.string().url("لینک معتبر وارد کنید").or(z.literal("")),
  description: z.string(),
  reminderDays: z.string(),
});

type EditSubscriptionForm = z.infer<typeof editSubscriptionSchema>;

const categories = [
  { value: "entertainment", label: "🎬 سرگرمی" },
  { value: "work", label: "💼 کاری" },
  { value: "cloud", label: "☁️ ذخیره‌سازی ابری" },
  { value: "development", label: "🛠️ ابزار توسعه" },
  { value: "education", label: "📚 آموزشی" },
  { value: "security", label: "🔒 امنیت" },
  { value: "health", label: "🏥 سلامت" },
  { value: "productivity", label: "🧠 بهره‌وری" },
  { value: "communication", label: "📧 ارتباطات" },
  { value: "shopping", label: "🛍️ خرید" },
  { value: "other", label: "📁 سایر" },
];

const groups = [
  { value: "", label: "بدون گروه" },
  { value: "1", label: "واحد نرم‌افزار" },
  { value: "2", label: "واحد فروش" },
  { value: "3", label: "واحد مالی" },
];

const reminderOptions = [
  { value: "1", label: "۱ روز قبل" },
  { value: "3", label: "۳ روز قبل" },
  { value: "7", label: "۷ روز قبل" },
  { value: "0", label: "خاموش" },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string | null;
}

const mockSubscription = {
  id: "1",
  name: "فیلیمو",
  category: "entertainment",
  categoryLabel: "🎬 سرگرمی",
  groupId: "1",
  groupLabel: "واحد نرم‌افزار",
  price: "59000",
  startDate: "1403-07-01",
  endDate: "1403-08-01",
  status: "expiring" as const,
  website: "https://filimo.com",
  description: "برای دیدن سریال جوکر",
  reminderDays: "3",
};

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  expiring: { label: "در شرف اتمام", variant: "warning" as const },
  expired: { label: "منقضی", variant: "danger" as const },
};

export const SubscriptionModal = ({
  isOpen,
  onClose,
  subscriptionId,
}: SubscriptionModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditSubscriptionForm>({
    resolver: zodResolver(editSubscriptionSchema),
    defaultValues: {
      name: mockSubscription.name,
      category: mockSubscription.category,
      groupId: mockSubscription.groupId,
      price: mockSubscription.price,
      startDate: mockSubscription.startDate,
      endDate: mockSubscription.endDate,
      website: mockSubscription.website,
      description: mockSubscription.description,
      reminderDays: mockSubscription.reminderDays,
    },
  });

  const onSubmit = async (data: EditSubscriptionForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete subscription", subscriptionId);
    onClose();
  };

  const handleRenew = () => {
    console.log("Renew subscription", subscriptionId);
  };

  const getStatusBadge = () => {
    const config = statusConfig[mockSubscription.status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isEditing) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mockSubscription.name}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">دسته‌بندی</p>
              <p className="text-white">{mockSubscription.categoryLabel}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">گروه</p>
              <p className="text-white">
                {mockSubscription.groupLabel || "بدون گروه"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">هزینه ماهانه</p>
              <p className="text-white text-lg font-semibold">
                {parseInt(mockSubscription.price).toLocaleString("fa-IR")} تومان
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
              <p className="text-white">{mockSubscription.startDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> تاریخ پایان
              </p>
              <p className="text-white">{mockSubscription.endDate}</p>
            </div>
          </div>

          {mockSubscription.website && (
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> لینک وب‌سایت
              </p>
              <a
                href={mockSubscription.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline text-sm"
              >
                {mockSubscription.website}
              </a>
            </div>
          )}

          {mockSubscription.description && (
            <div>
              <p className="text-gray-500 text-sm">توضیحات</p>
              <p className="text-gray-300 text-sm">
                {mockSubscription.description}
              </p>
            </div>
          )}

          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-500 text-sm mb-2">تنظیمات اعلان</p>
            <p className="text-white">
              یادآوری{" "}
              {reminderOptions.find(
                (o) => o.value === mockSubscription.reminderDays,
              )?.label || "۳ روز قبل"}{" "}
              از اتمام
            </p>
          </div>

          {mockSubscription.status === "expiring" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <p className="text-amber-400 text-sm">
                ⏰ این اشتراک به زودی منقضی می‌شود. برای تمدید اقدام کنید.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              ویرایش
            </Button>
            {mockSubscription.status === "expiring" && (
              <Button variant="primary" onClick={handleRenew}>
                تمدید اشتراک
              </Button>
            )}
            <Button variant="danger" onClick={handleDelete}>
              حذف
            </Button>
            <Button variant="outline" onClick={onClose}>
              بستن
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
            options={categories}
            error={errors.category?.message}
            {...register("category")}
          />
          <Select label="گروه" options={groups} {...register("groupId")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="هزینه ماهانه (تومان)"
            type="number"
            placeholder="۵۹۰۰۰"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="تاریخ شروع"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="تاریخ پایان"
            type="date"
            error={errors.endDate?.message}
            {...register("endDate")}
          />
          <Input
            label="لینک وب‌سایت (اختیاری)"
            placeholder="https://filimo.com"
            error={errors.website?.message}
            {...register("website")}
          />
        </div>

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
          <Button type="submit" variant="primary" loading={isSubmitting}>
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
