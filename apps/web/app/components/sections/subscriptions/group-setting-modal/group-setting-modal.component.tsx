// app/components/sections/subscriptions/GroupSettingsModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components";

const groupSettingsSchema = z.object({
  name: z.string().min(1, "نام گروه الزامی است"),
  supervisorId: z.string(),
});

type GroupSettingsForm = z.infer<typeof groupSettingsSchema>;

const members = [
  { value: "", label: "بدون سرپرست" },
  { value: "user1", label: "علی حسینی" },
  { value: "user2", label: "سارا محمدی" },
  { value: "user3", label: "رضا کریمی" },
];

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
}

const mockGroup = {
  id: "1",
  name: "واحد نرم‌افزار",
  supervisorId: "user1",
};

export const GroupSettingsModal = ({ isOpen, onClose, groupId }: GroupSettingsModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GroupSettingsForm>({
    resolver: zodResolver(groupSettingsSchema),
    defaultValues: {
      name: mockGroup.name,
      supervisorId: mockGroup.supervisorId,
    },
  });

  const onSubmit = async (data: GroupSettingsForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Update group:", { id: groupId, ...data });
    onClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Delete group:", groupId);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تنظیمات گروه" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="نام گروه"
          placeholder="مثال: واحد نرم‌افزار"
          error={errors.name?.message}
          {...register("name")}
        />

        <Select
          label="سرپرست گروه"
          options={members}
          {...register("supervisorId")}
        />

        <div className="border-t border-gray-800 pt-4 mt-2">
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
            fullWidth
          >
            حذف گروه
          </Button>
          <p className="text-gray-500 text-xs text-center mt-2">
            با حذف گروه، تمام اشتراک‌های داخل آن به گروه پیش‌فرض منتقل می‌شوند
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isSubmitting}>
            ذخیره تغییرات
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};