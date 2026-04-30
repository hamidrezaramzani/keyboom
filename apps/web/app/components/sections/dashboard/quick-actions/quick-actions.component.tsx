"use client";

import { Button } from "@/app/components";
import { Plus } from "lucide-react";

interface QuickAddButtonProps {
  onClick: () => void;
}

export const QuickAddButton = ({ onClick }: QuickAddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      size="lg"
      icon={<Plus className="w-5 h-5" />}
      fullWidth
    >
      اضافه کردن اشتراک جدید
    </Button>
  );
};
