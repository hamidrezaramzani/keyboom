import { WorkspaceActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Workspace =
  WorkspaceActions["readMany"]["response"]["ok"]["data"]["list"][number];

export type WorkspaceList =
  WorkspaceActions["readMany"]["response"]["ok"]["data"];

export type WorkspaceMember = ERD<WorkspaceActions["readManyMembers"]>[0];
