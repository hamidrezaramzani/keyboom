"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout";
import {
  SubscriptionsHeader,
  Board,
  AddSubscriptionModal,
  GroupSettingsModal,
  AddWorkspaceModal,
  AddGroupModal,
} from "@/app/components/sections/subscriptions";
import { SubscriptionModal } from "@/app/components/sections/subscriptions/subscription-modal/subscription-modal.component";

interface Group {
  id: string;
  name: string;
  supervisorId?: string;
  subscriptions: Subscription[];
}

interface Subscription {
  id: string;
  name: string;
  price: number;
  status: "active" | "expiring" | "expired";
  endDate: string;
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "واحد نرم‌افزار",
    supervisorId: "user1",
    subscriptions: [
      {
        id: "1",
        name: "GitHub",
        price: 250000,
        status: "active",
        endDate: "2025-02-15",
      },
      {
        id: "2",
        name: "VS Code",
        price: 0,
        status: "active",
        endDate: "2025-12-31",
      },
      {
        id: "3",
        name: "AWS",
        price: 1200000,
        status: "expiring",
        endDate: "2025-01-10",
      },
    ],
  },
  {
    id: "2",
    name: "واحد فروش",
    supervisorId: "user2",
    subscriptions: [
      {
        id: "4",
        name: "پنل پیامکی",
        price: 350000,
        status: "active",
        endDate: "2025-01-20",
      },
      {
        id: "5",
        name: "CRM",
        price: 800000,
        status: "expiring",
        endDate: "2025-01-08",
      },
    ],
  },
  {
    id: "3",
    name: "واحد مالی",
    subscriptions: [
      {
        id: "6",
        name: "نرم‌افزار حسابداری",
        price: 600000,
        status: "active",
        endDate: "2025-01-25",
      },
    ],
  },
];

export default function SubscriptionsPage() {
  const [groups, setGroups] = useState(mockGroups);
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [isSubscriptionDetailOpen, setIsSubscriptionDetailOpen] =
    useState(false);

  const handleGroupsReorder = (newGroups: Group[]) => {
    setGroups(newGroups);
  };

  const handleAddGroup = () => {
    setIsAddGroupOpen(true);
  };

  const handleGroupAdded = (groupName: string, supervisorId: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      supervisorId: supervisorId || undefined,
      subscriptions: [],
    };
    setGroups([...groups, newGroup]);
  };

  const handleGroupSettings = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsGroupSettingsOpen(true);
  };

  const handleSubscriptionClick = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setIsSubscriptionDetailOpen(true);
  };

  const handleAddSubscription = () => {
    setIsAddSubscriptionOpen(true);
  };

  const handleSubscriptionMove = (
    subscriptionId: string,
    fromGroupId: string,
    toGroupId: string,
  ) => {
    const newGroups = [...groups];
    const fromGroup = newGroups.find((g) => g.id === fromGroupId);
    const toGroup = newGroups.find((g) => g.id === toGroupId);
    const movingSubscription = fromGroup?.subscriptions.find(
      (s) => s.id === subscriptionId,
    );

    if (fromGroup && toGroup && movingSubscription) {
      fromGroup.subscriptions = fromGroup.subscriptions.filter(
        (s) => s.id !== subscriptionId,
      );
      toGroup.subscriptions = [...toGroup.subscriptions, movingSubscription];
      setGroups(newGroups);
    }
  };

  const handleSubscriptionReorder = (
    groupId: string,
    newSubscriptions: Subscription[],
  ) => {
    const newGroups = groups.map((g) =>
      g.id === groupId ? { ...g, subscriptions: newSubscriptions } : g,
    );
    setGroups(newGroups);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SubscriptionsHeader />
        <Board
          groups={groups}
          onGroupsReorder={handleGroupsReorder}
          onAddGroup={handleAddGroup}
          onGroupSettings={handleGroupSettings}
          onSubscriptionClick={handleSubscriptionClick}
          onSubscriptionMove={handleSubscriptionMove}
          onSubscriptionReorder={handleSubscriptionReorder}
        />
      </div>

      <AddWorkspaceModal
        isOpen={isAddWorkspaceOpen}
        onClose={() => setIsAddWorkspaceOpen(false)}
      />

      <AddGroupModal
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
        onGroupAdded={handleGroupAdded}
      />

      <AddSubscriptionModal
        isOpen={isAddSubscriptionOpen}
        onClose={() => setIsAddSubscriptionOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionDetailOpen}
        onClose={() => setIsSubscriptionDetailOpen(false)}
        subscriptionId={selectedSubscriptionId}
      />

      <GroupSettingsModal
        isOpen={isGroupSettingsOpen}
        onClose={() => setIsGroupSettingsOpen(false)}
        groupId={selectedGroupId}
      />
    </DashboardLayout>
  );
}
