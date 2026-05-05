import { NotificationActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Notifications = ERD<NotificationActions["getRecent"]>["data"];

export type Notification = Notifications[number];
