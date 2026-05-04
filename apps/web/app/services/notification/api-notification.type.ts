import { NotificationActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Notifications = ERD<
  NotificationActions["getRecent"]
>["data"]["response"]["ok"]["data"]["data"];

export type Notification = ERD<
  NotificationActions["getRecent"]
>["data"]["response"]["ok"]["data"]["data"][number];
