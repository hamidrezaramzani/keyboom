/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import type { Draft } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { NotificationActions } from "@keyboom/contracts/client";

type NotificationsDraft = Draft<
  NotificationActions["getMany"]["response"]["ok"]
>;
type UnreadCountDraft = Draft<
  NotificationActions["getUnreadCount"]["response"]["ok"]
>;

export const handleOnCacheEntryAdded = async (
  _arg: void,
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleNotificationNew = (data: { notification: any }) => {
    updateCachedData((draft: NotificationsDraft) => {
      draft.data.unshift(data.notification);
      if (draft.data.length > 20) {
        draft.data.pop();
      }
    });
  };

  const handleNotificationRead = (data: { notificationId: string }) => {
    updateCachedData((draft: NotificationsDraft) => {
      const notification = draft.data.find((n) => n.id === data.notificationId);
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData((draft: NotificationsDraft) => {
      draft.data.forEach((notification) => {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      });
    });
  };

  socket.on("notification:new", handleNotificationNew);
  socket.on("notification:read", handleNotificationRead);
  socket.on("notification:all-read", handleAllNotificationsRead);

  await cacheEntryRemoved;

  socket.off("notification:new", handleNotificationNew);
  socket.off("notification:read", handleNotificationRead);
  socket.off("notification:all-read", handleAllNotificationsRead);
};

export const handleOnCacheEntryCountAdded = async (
  _arg: void,
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleNotificationNew = () => {
    updateCachedData((draft: UnreadCountDraft) => {
      draft.data.count += 1;
    });
  };

  const handleNotificationRead = () => {
    updateCachedData((draft: UnreadCountDraft) => {
      if (draft.data.count > 0) {
        draft.data.count -= 1;
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData((draft: UnreadCountDraft) => {
      draft.data.count = 0;
    });
  };

  socket.on("notification:new", handleNotificationNew);
  socket.on("notification:read", handleNotificationRead);
  socket.on("notification:all-read", handleAllNotificationsRead);

  await cacheEntryRemoved;

  socket.off("notification:new", handleNotificationNew);
  socket.off("notification:read", handleNotificationRead);
  socket.off("notification:all-read", handleAllNotificationsRead);
};
