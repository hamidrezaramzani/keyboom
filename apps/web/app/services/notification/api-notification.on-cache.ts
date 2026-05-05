/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { NotificationActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";
import { getSocket } from "../socket";
import { Notification } from "./api-notification.type";

export const handleOnCacheEntryAdded = async (
  _arg: void,
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleNotificationNew = (data: { notification: Notification }) => {
    updateCachedData((draft: ERD<NotificationActions["getMany"]>) => {
      draft.data.unshift(data.notification);
      if (draft.data.length > 20) {
        draft.data.pop();
      }
    });
  };

  const handleNotificationRead = (data: { notificationId: string }) => {
    updateCachedData((draft: ERD<NotificationActions["getMany"]>) => {
      const notification = draft.data.find(
        (n: { id: string }) => n.id === data.notificationId,
      );
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date();
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData((draft: ERD<NotificationActions["getMany"]>) => {
      draft.data.forEach((notification) => {
        notification.isRead = true;
        notification.readAt = new Date();
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
    updateCachedData((draft: ERD<NotificationActions["getUnreadCount"]>) => {
      const audio = new Audio("/notif.mp3");
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      draft.data.count += 1;
    });
  };

  const handleNotificationRead = () => {
    updateCachedData((draft: ERD<NotificationActions["getUnreadCount"]>) => {
      if (draft.data.count > 0) {
        draft.data.count -= 1;
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData((draft: ERD<NotificationActions["getUnreadCount"]>) => {
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
