"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  Board,
  AddSubscriptionModal,
  GroupSettingsModal,
  AddWorkspaceModal,
  AddGroupModal,
  SubscriptionModal,
} from "@/app/components/sections/subscriptions";
import { useState } from "react";
import {
  useGetWorkspaceMembersQuery,
  useReadManyWorkspacesQuery,
} from "../../services/workspace";
import {
  GroupSubscription,
  useCreateGroupMutation,
  useGetGroupsQuery,
  useReorderGroupsMutation,
} from "../../services/group";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Button,
  DashboardContentHeader,
  Drawer,
  WorkspaceMembers,
  Tabs,
} from "@/app/components";
import { CircuitBoard, IdCard, Menu, Users } from "lucide-react";
import { WorkspaceArchivedGroups } from "@/app/components/sections/dashboard/workspaces";

export default function SubscriptionsPage() {
  const { data: workspace } = useReadManyWorkspacesQuery({});
  const { data: members } = useGetWorkspaceMembersQuery(
    workspace
      ? {
          params: {
            workspaceId: workspace.defaultWorkspace.id,
          },
        }
      : skipToken,
  );
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
    useState<GroupSubscription>();
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [isSubscriptionDetailOpen, setIsSubscriptionDetailOpen] =
    useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleSubscriptionClick = (subscription: GroupSubscription) => {
    setSelectedSubscription(subscription);
    setIsSubscriptionDetailOpen(true);
  };

  const handleAddSubscription = (groupId: string, groupName: string) => {
    setIsAddSubscriptionOpen(true);
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
  };

  const activeGroups = groups.filter((group) => !group.isArchived);
  const archivedGroups = groups.filter((group) => group.isArchived);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardContentHeader
          Icon={IdCard}
          title={"اشتراک ها"}
          description={"مدیریت اشتراک های فضای کاری"}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu fontSize={10} />
            </Button>
          }
        />
        <Board
          groups={activeGroups}
          onGroupsReorder={handleGroupsReorder}
          onAddGroup={handleAddGroup}
          onGroupSettings={handleGroupSettings}
          onSubscriptionClick={handleSubscriptionClick}
          onAddSubscription={handleAddSubscription}
          onSubscriptionMove={() => {}}
          onSubscriptionReorder={() => {}}
          workspaceId={workspace?.defaultWorkspace.id}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="left"
        size="full"
      >
        <div className="mt-15">
          <Tabs
            defaultTab="users"
            tabs={[
              {
                id: "users",
                icon: Users,
                label: "کاربران",
                content: <WorkspaceMembers members={members} />,
              },
              {
                id: "archvied-groups",
                icon: CircuitBoard,
                label: "گروه های آرشیو شده",
                content: <WorkspaceArchivedGroups groups={archivedGroups} />,
              },
            ]}
          />
        </div>
      </Drawer>

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
        workspaceId={workspace?.defaultWorkspace.id}
      />

      <SubscriptionModal
        isOpen={isSubscriptionDetailOpen}
        onClose={() => {
          setIsSubscriptionDetailOpen(false);
          setSelectedSubscription(undefined);
        }}
        subscription={selectedSubscription}
        workspaceId={workspace?.defaultWorkspace.id}
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
