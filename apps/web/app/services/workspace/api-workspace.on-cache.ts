import { getSocket } from "../socket";
import { ERD, QueryArgsNew } from "../api.type";
import { WorkspaceActions, WorkspaceEvents } from "@keyboom/contracts/client";

export const handleWorkspaceCacheEntryAdded = async (
  _arg: QueryArgsNew<WorkspaceActions["readMany"]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleWorkspaceCreated = (data: {
    workspace: ERD<WorkspaceActions["readMany"]>["list"][number];
  }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      draft.list.push(data.workspace);
    });
  };

  const handleWorkspaceUpdated = ({
    workspace,
  }: {
    workspace: WorkspaceEvents["workspaceUpdated"];
  }) => {
    try {
      updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
        const index = draft.list.findIndex((w) => w.id === workspace.id);
        if (index !== -1) {
          draft.list[index].name = workspace.name;
        }

        if (draft.defaultWorkspace.id === workspace.id) {
          draft.defaultWorkspace.name = workspace.name;
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleWorkspaceArchived = (data: { workspaceId: string }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      const index = draft.list.findIndex((w) => w.id === data.workspaceId);
      if (index !== -1) {
        draft.list[index].isArchive = true;
      }
      if (draft.defaultWorkspace.id === data.workspaceId) {
        const newDefault = draft.list.find((w) => w.id !== data.workspaceId);
        if (newDefault) {
          draft.defaultWorkspace = newDefault;
        }
      }
    });
  };

  const handleWorkspaceRestored = (data: { workspaceId: string }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      const index = draft.list.findIndex((w) => w.id === data.workspaceId);
      if (index !== -1) {
        draft.list[index].isArchive = false;
      }
    });
  };

  const handleWorkspaceDeleted = (data: { workspaceId: string }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      const index = draft.list.findIndex((w) => w.id === data.workspaceId);
      if (index !== -1) {
        draft.list.splice(index, 1);
      }
      if (draft.defaultWorkspace.id === data.workspaceId) {
        const newDefault = draft.list[0];
        if (newDefault) {
          draft.defaultWorkspace = newDefault;
        }
      }
    });
  };

  const handleWorkspaceLeft = (data: { workspaceId: string }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      const index = draft.list.findIndex((w) => w.id === data.workspaceId);
      if (index !== -1) {
        draft.list.splice(index, 1);
      }
      if (draft.defaultWorkspace.id === data.workspaceId) {
        const newDefault = draft.list[0];
        if (newDefault) {
          draft.defaultWorkspace = newDefault;
        }
      }
    });
  };

  const handleUserRemovedFromWorkspace = (data: {
    workspaceId: string;
    userId: string;
  }) => {
    updateCachedData((draft: ERD<WorkspaceActions["readMany"]>) => {
      const index = draft.list.findIndex((w) => w.id === data.workspaceId);
      if (index !== -1) {
        draft.list.splice(index, 1);
      }
      if (draft.defaultWorkspace.id === data.workspaceId) {
        const newDefault = draft.list[0];
        if (newDefault) {
          draft.defaultWorkspace = newDefault;
        }
      }
    });
  };

  socket.on("workspace:joined", () => {});

  socket.on("workspace:created", handleWorkspaceCreated);
  socket.on("workspace:updated", handleWorkspaceUpdated);
  socket.on("workspace:archived", handleWorkspaceArchived);
  socket.on("workspace:restored", handleWorkspaceRestored);
  socket.on("workspace:deleted", handleWorkspaceDeleted);
  socket.on("workspace:left", handleWorkspaceLeft);
  socket.on("workspace:userRemoved", handleUserRemovedFromWorkspace);

  await cacheEntryRemoved;

  socket.off("workspace:joined", () => {});
  socket.off("workspace:created", handleWorkspaceCreated);
  socket.off("workspace:updated", handleWorkspaceUpdated);
  socket.off("workspace:archived", handleWorkspaceArchived);
  socket.off("workspace:restored", handleWorkspaceRestored);
  socket.off("workspace:deleted", handleWorkspaceDeleted);
  socket.off("workspace:left", handleWorkspaceLeft);
  socket.off("workspace:userRemoved", handleUserRemovedFromWorkspace);
};
