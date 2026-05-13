"use client";

import { useState } from "react";
import {
  SubscriptionPeriod,
  useDeletePeriodMutation,
  useGetPeriodsQuery,
} from "@/app/services/subscription-period";
import { Button, Tooltip } from "@/app/components/ui";
import { Trash2, Edit, Plus, AlertCircle } from "lucide-react";
import { SubscriptionPeriodFormModal } from "../../subscription-period-form/subscription-period-form.component";
import { useConfirm } from "@/app/lib/store/context";
import { toast } from "@/app/lib";

interface SubscriptionPeriodListProps {
  subscriptionId: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  onPeriodChange?: () => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString("fa-IR") + " تومان";
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("fa-IR");
};

export const SubscriptionPeriodList = ({
  subscriptionId,
  subscriptionStartDate,
  subscriptionEndDate,
  onPeriodChange,
}: SubscriptionPeriodListProps) => {
  const { data: periods = [], refetch } = useGetPeriodsQuery({
    params: { subscriptionId },
  });

  const [deletePeriod, { isLoading: isDeleting }] = useDeletePeriodMutation();
  const { confirm } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<SubscriptionPeriod | null>(
    null,
  );

  const handleAdd = () => {
    setEditingPeriod(null);
    setIsModalOpen(true);
  };

  const handleEdit = (period: SubscriptionPeriod) => {
    setEditingPeriod(period);
    setIsModalOpen(true);
  };

  const handleDelete = async (periodId: string, periodTitle: string) => {
    const confirmed = await confirm({
      title: "حذف بازه قیمتی",
      description: `آیا از حذف بازه "${periodTitle}" مطمئن هستید؟`,
      confirmText: "حذف",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await deletePeriod({ params: { periodId, subscriptionId } }).unwrap();
      toast.success("بازه قیمتی با موفقیت حذف شد");
      refetch();
      onPeriodChange?.();
    } catch (error) {
      toast.error("خطا در حذف بازه قیمتی");
      console.error("Delete period error:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPeriod(null);
    refetch();
    onPeriodChange?.();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-5">
        <h3 className="text-white font-semibold">بازه‌های قیمتی</h3>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAdd}
        >
          افزودن بازه جدید
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr className="text-right">
              <th className="pb-3 text-gray-400 font-medium">عنوان</th>
              <th className="pb-3 text-gray-400 font-medium">تاریخ شروع</th>
              <th className="pb-3 text-gray-400 font-medium">تاریخ پایان</th>
              <th className="pb-3 text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <span>قیمت ماهانه</span>{" "}
                  <Tooltip
                    content={
                      "در گزارشات، قیمت روزانه اشتراک بر اساس قیمت ماهانه و تعداد روز بازه محاسبه خواهد شد"
                    }
                  >
                    <AlertCircle className="text-indigo-400" size="13" />
                  </Tooltip>
                </div>
              </th>
              <th className="pb-3 text-gray-400 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  هیچ بازه قیمتی تعریف نشده است
                </td>
              </tr>
            ) : (
              periods?.map((period) => (
                <tr key={period.id} className="border-b border-gray-800">
                  <td className="py-3 text-white">{period.title}</td>
                  <td className="py-3 text-gray-300">
                    {formatDate(period.startDate)}
                  </td>
                  <td className="py-3 text-gray-300">
                    {formatDate(period.endDate)}
                  </td>
                  <td className="py-3 text-gray-300">
                    {formatPrice(period.monthlyPrice)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(period)}
                        className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(period.id, period.title)}
                        disabled={isDeleting}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SubscriptionPeriodFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subscriptionId={subscriptionId}
        subscriptionStartDate={subscriptionStartDate}
        subscriptionEndDate={subscriptionEndDate}
        period={editingPeriod}
        onSuccess={handleModalClose}
      />
    </div>
  );
};
