"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";

const addGroupSchema = z.object({
  name: z.string().min(1, "نام گروه الزامی است"),
});

type AddGroupForm = z.infer<typeof addGroupSchema>;

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: (groupName: string) => void;
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
    },
  });

  const onSubmit = async (data: AddGroupForm) => {
    console.log(data);

    onGroupAdded(data.name);
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
