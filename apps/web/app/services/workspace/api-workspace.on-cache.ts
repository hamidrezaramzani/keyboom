/* eslint-disable no-param-reassign */

import type { Draft } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { ERD } from "../api.type";
import { WorkspaceActions, WorkspaceEvents } from "@keyboom/contracts/client";

export const handleWorkspaceCacheUpdate = async (
  updateCachedData: (
    updateFn: (
      draft: Draft<ERD<WorkspaceActions["readMany"]["response"]["ok"]>>,
    ) => void,
  ) => void,
) => {
  const socket = await getSocket();

  const handleWorkspaceUpdated = (
    event: WorkspaceEvents["workspaceUpdated"],
  ) => {
    updateCachedData((draft) => {
      const index = draft.data.data.list.findIndex(
        (workspace) => workspace.id === event.workspace.id,
      );
      if (index !== -1) {
        draft.data.data.list[index] = event.workspace;
      }
    });
  };

  const handleWorkspaceAdded = (event: WorkspaceEvents["workspaceAdded"]) => {
    updateCachedData((draft) => {
      draft.data.data.list.push(event.workspace);
    });
  };

  socket.on("workspace:added", handleWorkspaceAdded);
  socket.on("workspace:updated", handleWorkspaceUpdated);

  return () => {
    socket.off("workspace:added", handleWorkspaceAdded);
    socket.off("workspace:updated", handleWorkspaceUpdated);
  };
};
