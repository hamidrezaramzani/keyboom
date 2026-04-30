// app/components/sections/subscriptions/AddGroupModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button, Select } from "@/app/components";

const addGroupSchema = z.object({
  name: z.string().min(1, "نام گروه الزامی است"),
  supervisorId: z.string(),
});

type AddGroupForm = z.infer<typeof addGroupSchema>;

const members = [
  { value: "", label: "بدون سرپرست" },
  { value: "user1", label: "علی حسینی" },
  { value: "user2", label: "سارا محمدی" },
  { value: "user3", label: "رضا کریمی" },
];

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: (groupName: string, supervisorId: string) => void;
}

export const AddGroupModal = ({
  isOpen,
  onClose,
  onGroupAdded,
}: AddGroupModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddGroupForm>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      supervisorId: "",
    },
  });

  const onSubmit = async (data: AddGroupForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onGroupAdded(data.name, data.supervisorId);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="افزودن گروه جدید" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="نام گروه"
          placeholder="مثال: واحد بازاریابی"
          error={errors.name?.message}
          {...register("name")}
        />

        <Select
          label="سرپرست گروه (اختیاری)"
          options={members}
          {...register("supervisorId")}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isSubmitting}>
            ایجاد گروه
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};
