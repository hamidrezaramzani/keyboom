"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  SubscriptionsHeader,
  Board,
  AddSubscriptionModal,
  GroupSettingsModal,
  AddWorkspaceModal,
  AddGroupModal,
  SubscriptionModal,
} from "@/app/components/sections/subscriptions";
import { useState } from "react";
import { useReadManyWorkspacesQuery } from "../services/workspace";
import {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useReorderGroupsMutation,
} from "../services/group";
import { skipToken } from "@reduxjs/toolkit/query";
import { Subscription } from "../services/subscription";

export default function SubscriptionsPage() {
  const { data: workspace } = useReadManyWorkspacesQuery({});
  const { data: groupsData = [], refetch: refetchGroups } = useGetGroupsQuery(
    workspace
      ? { params: { workspaceId: workspace?.defaultWorkspace.id } }
      : skipToken,
  );
  const [createGroup] = useCreateGroupMutation();
  const [reorderGroups] = useReorderGroupsMutation();

  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string>();
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [isSubscriptionDetailOpen, setIsSubscriptionDetailOpen] =
    useState(false);

  const groups = groupsData || [];

  const handleGroupsReorder = async (newGroups: typeof groups) => {
    const groupIds = newGroups?.map((g) => g.id);
    await reorderGroups({ payload: { groupIds } });
  };

  const handleAddGroup = () => {
    setIsAddGroupOpen(true);
  };

  const handleGroupAdded = async (groupName: string) => {
    await createGroup({ payload: { name: groupName } });
    refetchGroups();
  };

  const handleGroupSettings = (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setIsGroupSettingsOpen(true);
  };

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsSubscriptionDetailOpen(true);
  };

  const handleAddSubscription = (groupId: string, groupName: string) => {
    setIsAddSubscriptionOpen(true);
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
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
          onAddSubscription={handleAddSubscription}
          onSubscriptionMove={() => {}}
          onSubscriptionReorder={() => {}}
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
        defaultGroupId={selectedGroupId}
        groups={groups}
      />

      <SubscriptionModal
        isOpen={isSubscriptionDetailOpen}
        onClose={() => setIsSubscriptionDetailOpen(false)}
        subscription={selectedSubscription}
        groupName={selectedGroupName}
      />

      <GroupSettingsModal
        isOpen={isGroupSettingsOpen}
        onClose={() => setIsGroupSettingsOpen(false)}
        groupId={selectedGroupId}
        groupName={selectedGroupName}
      />
    </DashboardLayout>
  );
}
