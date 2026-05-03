import { WorkspaceActions } from "@keyboom/contracts/client";

export type Workspace =
  WorkspaceActions["readMany"]["response"]["ok"]["data"]["list"][number];

export type WorkspaceList =
  WorkspaceActions["readMany"]["response"]["ok"]["data"];
