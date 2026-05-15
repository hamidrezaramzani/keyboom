"use client";

import { ShoppingCart } from "lucide-react";
import { DashboardContentHeader } from "../../dashboard";

export const SubscriptionsHeader = () => {
  return (
    <DashboardContentHeader
      title="اشتراک ها"
      description="مدیریت اشتراک های فضای کاری"
      Icon={ShoppingCart}
    />
  );
};
