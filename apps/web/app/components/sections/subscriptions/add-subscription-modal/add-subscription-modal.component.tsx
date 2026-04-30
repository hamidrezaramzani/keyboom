// app/components/subscriptions/AddSubscriptionModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components";

const addSubscriptionSchema = z.object({
  name: z.string().min(1, "نام اشتراک الزامی است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  groupId: z.string(),
  price: z.string().min(1, "قیمت الزامی است"),
  startDate: z.string().min(1, "تاریخ شروع الزامی است"),
  endDate: z.string().min(1, "تاریخ پایان الزامی است"),
  website: z.string().url("لینک معتبر وارد کنید").or(z.literal("")),
  description: z.string(),
});

type AddSubscriptionForm = z.infer<typeof addSubscriptionSchema>;

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

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSubscriptionModal = ({
  isOpen,
  onClose,
}: AddSubscriptionModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddSubscriptionForm>({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: {
      name: "",
      category: "",
      groupId: "",
      price: "",
      startDate: "",
      endDate: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = async (data: AddSubscriptionForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
    onClose();
  };

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

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isSubmitting}>
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
