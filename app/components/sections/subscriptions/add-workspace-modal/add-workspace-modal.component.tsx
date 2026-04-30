// app/components/sections/subscriptions/AddWorkspaceModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";

const addWorkspaceSchema = z.object({
  name: z.string().min(1, "نام فضای کاری الزامی است"),
});

type AddWorkspaceForm = z.infer<typeof addWorkspaceSchema>;

interface AddWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWorkspaceModal = ({ isOpen, onClose }: AddWorkspaceModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddWorkspaceForm>({
    resolver: zodResolver(addWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: AddWorkspaceForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Create workspace:", data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ساخت فضای کاری جدید" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="نام فضای کاری"
          placeholder="مثال: شرکت کیان"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" loading={isSubmitting}>
            ایجاد فضای کاری
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
};