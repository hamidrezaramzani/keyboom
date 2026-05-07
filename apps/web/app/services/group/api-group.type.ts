import { GroupActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Group = ERD<GroupActions["readMany"]>[number];

export type Subscription = ERD<
  GroupActions["readMany"]
>[number]["subscriptions"][number];
