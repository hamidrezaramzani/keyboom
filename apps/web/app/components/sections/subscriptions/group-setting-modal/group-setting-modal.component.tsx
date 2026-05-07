"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/app/components";
import { Archive, RotateCcw } from "lucide-react";
import { useConfirm } from "@/app/lib/store/context";
import {
  useArchiveGroupMutation,
  useDeleteGroupMutation,
  useRestoreGroupMutation,
  useUpdateGroupMutation,
} from "@/app/services/group";
import { toast } from "@/app/lib";

const groupSettingsSchema = z.object({
  name: z.string().min(1, "نام گروه الزامی است"),
});

type GroupSettingsForm = z.infer<typeof groupSettingsSchema>;

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  groupName?: string;
  isArchived?: boolean;
  onSuccess?: () => void;
}

export const GroupSettingsModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  isArchived = false,
  onSuccess,
}: GroupSettingsModalProps) => {
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const [archiveGroup, { isLoading: isArchiving }] = useArchiveGroupMutation();
  const [restoreGroup, { isLoading: isRestoring }] = useRestoreGroupMutation();
  const { confirm } = useConfirm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupSettingsForm>({
    resolver: zodResolver(groupSettingsSchema),
    defaultValues: {
      name: groupName || "",
    },
  });

  const onSubmit = async (data: GroupSettingsForm) => {
    if (!groupId) return;

    try {
      await updateGroup({
        params: { groupId },
        payload: { name: data.name },
      }).unwrap();
      toast.success("نام گروه با موفقیت تغییر یافت");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در تغییر نام گروه");
      console.error("Update group error:", error);
    }
  };

  const handleArchive = async () => {
    if (!groupId) return;

    const confirmed = await confirm({
      title: "آرشیو گروه",
      description:
        "آیا از آرشیو این گروه مطمئن هستید؟ گروه از حالت فعال خارج می‌شود اما قابل بازیابی است.",
      confirmText: "آرشیو",
      variant: "warning",
    });

    if (!confirmed) return;

    try {
      await archiveGroup({ params: { groupId } }).unwrap();
      toast.success("گروه با موفقیت آرشیو شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در آرشیو گروه");
      console.error("Archive group error:", error);
    }
  };

  const handleRestore = async () => {
    if (!groupId) return;

    const confirmed = await confirm({
      title: "بازیابی گروه",
      description:
        "آیا از بازیابی این گروه مطمئن هستید؟ گروه دوباره در لیست فعال نمایش داده می‌شود.",
      confirmText: "بازیابی",
      variant: "info",
    });

    if (!confirmed) return;

    try {
      await restoreGroup({ params: { groupId } }).unwrap();
      toast.success("گروه با موفقیت بازیابی شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در بازیابی گروه");
      console.error("Restore group error:", error);
    }
  };

  const handleDelete = async () => {
    if (!groupId) return;

    const confirmed = await confirm({
      title: "حذف گروه",
      description:
        "آیا از حذف این گروه مطمئن هستید؟ تمام اشتراک‌های داخل این گروه به گروه پیش‌فرض منتقل می‌شوند. این عمل غیرقابل بازگشت است.",
      confirmText: "حذف",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await deleteGroup({ params: { groupId } }).unwrap();
      toast.success("گروه با موفقیت حذف شد");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("خطا در حذف گروه");
      console.error("Delete group error:", error);
    }
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

        <div className="border-t border-gray-800 pt-4 mt-2 space-y-3">
          {!isArchived ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleArchive}
              loading={isArchiving}
              fullWidth
              icon={<Archive className="w-4 h-4" />}
            >
              آرشیو گروه
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleRestore}
              loading={isRestoring}
              fullWidth
              icon={<RotateCcw className="w-4 h-4" />}
            >
              بازیابی گروه
            </Button>
          )}

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
          <Button type="submit" variant="primary" loading={isUpdating}>
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
