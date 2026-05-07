import { WorkspaceActions } from "@keyboom/contracts/client";

export const WORKSPACE_ENDPOINTS = {
  readMany: "workspaces",
  create: "workspaces",
  readManyMembers: (workspaceId: string) => `workspaces/${workspaceId}/members`,
  updateCurrent: "workspaces/current",
  updateSettings: (params?: WorkspaceActions["updateSetting"]["params"]) =>
    `workspaces/update-settings/${params?.workspaceId}`,
  delete: (workspaceId: string) => `/workspaces/${workspaceId}`,
  leave: (workspaceId: string) => `/workspaces/${workspaceId}/leave`,
};
