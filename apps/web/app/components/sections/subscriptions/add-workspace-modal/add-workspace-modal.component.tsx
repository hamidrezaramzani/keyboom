// app/components/sections/subscriptions/AddWorkspaceModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import { useCreateWorkspaceMutation } from "@/app/services/workspace";
import { toast } from "@/app/lib";

const addWorkspaceSchema = z.object({
  name: z.string().min(1, "نام فضای کاری الزامی است"),
});

type AddWorkspaceForm = z.infer<typeof addWorkspaceSchema>;

interface AddWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWorkspaceModal = ({
  isOpen,
  onClose,
}: AddWorkspaceModalProps) => {
  const [createWorkspace] = useCreateWorkspaceMutation();

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
    try {
      await createWorkspace({ payload: data }).unwrap();
      toast.success("فضای کاری جدید با موفقیت اضافه شد");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("خطا در ایجاد فضای کاری جدید");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ساخت فضای کاری جدید"
      size="md"
    >
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
