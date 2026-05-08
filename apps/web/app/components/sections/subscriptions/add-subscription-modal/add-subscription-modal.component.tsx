"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components";
import { useReadManyCategoriesQuery } from "@/app/services/category";
import { toast } from "@/app/lib";
import { useCreateSubscriptionMutation } from "@/app/services/subscription/api-subscription.endpoint";
import { Group } from "@/app/services/group";

const addSubscriptionSchema = z.object({
  name: z.string().min(1, "نام اشتراک الزامی است"),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  groupId: z.string().min(1, "گروه الزامی است"),
  price: z.string().min(1, "قیمت الزامی است"),
  startDate: z.string().min(1, "تاریخ شروع الزامی است"),
  endDate: z.string().min(1, "تاریخ پایان الزامی است"),
  website: z.string().url("لینک معتبر وارد کنید").or(z.literal("")),
  description: z.string(),
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
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddSubscriptionForm>({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      groupId: defaultGroupId || "",
      price: "",
      startDate: "",
      endDate: "",
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
            error={errors.groupId?.message}
            {...register("groupId")}
          />
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
