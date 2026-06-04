"use client";

import { Modal, Tabs } from "@/app/components";
import { GroupSubscription } from "@/app/services/group";
import { SubscriptionGeneralDetails } from "./subscription-general-details/subscription-general-details.component";
import { CalendarRange, Settings } from "lucide-react";
import { SubscriptionPeriodList } from "./subscription-periods-list/subscription-periods-list.component";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: GroupSubscription;
  workspaceId?: string;
  onSuccess?: () => void;
}

export const SubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
  workspaceId,
  onSuccess,
}: SubscriptionModalProps) => {
  if (!subscription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ویرایش اشتراک" size="lg">
      <Tabs
        defaultTab="subscription-general-details"
        tabs={[
          {
            id: "subscription-general-details",
            label: "اطلاعات عمومی",
            content: (
              <SubscriptionGeneralDetails
                onSuccess={onSuccess}
                workspaceId={workspaceId}
                isOpen={isOpen}
                onClose={onClose}
                subscription={subscription}
              />
            ),
            icon: Settings,
          },
          {
            id: "subscription-periods",
            label: "بازه های تغییر قیمت",
            content: (
              <SubscriptionPeriodList
                subscriptionId={subscription.id}
                subscriptionStartDate={subscription.startDate}
                subscriptionEndDate={subscription.endDate}
              />
            ),
            icon: CalendarRange,
          },
        ]}
      />
    </Modal>
  );
};
