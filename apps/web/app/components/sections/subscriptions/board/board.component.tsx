"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardColumn } from "../board-column/board-column.component";
import { AddGroupColumn } from "../add-group-column/add-group-column.component";
import { Group, Subscription } from "@/app/services/group";

interface BoardProps {
  groups: Group[];
  onGroupsReorder: (groups: Group[]) => void;
  onAddGroup: () => void;
  onGroupSettings: (groupId: string, groupName: string) => void;
  onSubscriptionClick: (subscriptionId: string) => void;
  onSubscriptionMove?: (
    subscriptionId: string,
    fromGroupId: string,
    toGroupId: string,
  ) => void;
  onSubscriptionReorder: (
    groupId: string,
    newSubscriptions: Subscription[],
  ) => void;
  onAddSubscription: (groupId: string) => void;
}

export const Board = ({
  groups,
  onGroupsReorder,
  onAddGroup,
  onGroupSettings,
  onSubscriptionClick,
  onSubscriptionMove,
  onSubscriptionReorder,
  onAddSubscription,
}: BoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeGroup = groups.find((g) =>
      g.subscriptions.some((s) => s.id === activeId),
    );
    const overGroup = groups.find((g) =>
      g.subscriptions.some((s) => s.id === overId),
    );
    const activeIsGroup = groups.some((g) => g.id === activeId);
    const overIsGroup = groups.some((g) => g.id === overId);

    if (activeIsGroup && overIsGroup) {
      const oldIndex = groups.findIndex((g) => g.id === activeId);
      const newIndex = groups.findIndex((g) => g.id === overId);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      onGroupsReorder(newGroups);
      return;
    }

    if (!activeIsGroup && !overIsGroup && activeGroup && overGroup) {
      const activeSubIndex = activeGroup.subscriptions.findIndex(
        (s) => s.id === activeId,
      );
      const overSubIndex = overGroup.subscriptions.findIndex(
        (s) => s.id === overId,
      );

      if (activeGroup.id === overGroup.id) {
        const newSubscriptions = arrayMove(
          activeGroup.subscriptions,
          activeSubIndex,
          overSubIndex,
        );
        onSubscriptionReorder(activeGroup.id, newSubscriptions);
      } else if (onSubscriptionMove) {
        onSubscriptionMove(activeId, activeGroup.id, overGroup.id);
      }
      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        <SortableContext
          items={groups.map((g) => g.id)}
          strategy={horizontalListSortingStrategy}
        >
          {groups.map((group) => (
            <BoardColumn
              key={group.id}
              group={group}
              onSettings={() => onGroupSettings(group.id, group.name)}
              onSubscriptionClick={onSubscriptionClick}
              onAddSubscriptionClick={onAddSubscription}
            />
          ))}
        </SortableContext>
        <AddGroupColumn onClick={onAddGroup} />
      </div>
    </DndContext>
  );
};
