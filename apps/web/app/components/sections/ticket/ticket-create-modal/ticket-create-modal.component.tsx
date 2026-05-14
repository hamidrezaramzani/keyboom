"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components/ui";
import { useCreateTicketMutation } from "@/app/services/ticket";
import { toast } from "@/app/lib";

const createTicketSchema = z.object({
  title: z.string().min(1, "عنوان تیکت الزامی است"),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["subscription", "workspace", "general"]),
  message: z.string().min(1, "متن پیام الزامی است"),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const priorityOptions = [
  { value: "low", label: "کم" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "بالا" },
];

const categoryOptions = [
  { value: "subscription", label: "اشتراک" },
  { value: "workspace", label: "فضای کاری" },
  { value: "general", label: "عمومی" },
];

export const CreateTicketModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketModalProps) => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      category: "general",
      message: "",
    },
  });

  const onSubmit = async (data: CreateTicketForm) => {
    try {
      await createTicket({
        payload: {
          title: data.title,
          priority: data.priority,
          category: data.category,
          message: data.message,
        },
      }).unwrap();
      toast.success("تیکت با موفقیت ایجاد شد");
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در ایجاد تیکت");
      console.error("Create ticket error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ایجاد تیکت جدید" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="مثال: مشکل در ثبت اشتراک"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="اولویت"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register("priority")}
          />
          <Select
            label="دسته‌بندی"
            options={categoryOptions}
            error={errors.category?.message}
            {...register("category")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            توضیحات
          </label>
          <textarea
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={5}
            placeholder="مشکل خود را به طور کامل توضیح دهید..."
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isLoading}>
            ارسال تیکت
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
