/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { getSocket } from "../socket";
import { Notification } from "./api-notification.type";

export const handleOnCacheEntryAdded = async (
  _arg: void,
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleNotificationNew = (data: { notification: Notification }) => {
    updateCachedData(
      (draft: {
        data: {
          id: string;
          userId: string;
          workspaceId: string | null;
          type: string;
          title: string;
          message: string;
          metadata: string | null;
          isRead: boolean;
          createdAt: Date;
          readAt: Date | null;
        }[];
      }) => {
        draft.data.unshift(data.notification);
        if (draft.data.length > 20) {
          draft.data.pop();
        }
      },
    );
  };

  const handleNotificationRead = (data: { notificationId: string }) => {
    updateCachedData((draft: { data: any[] }) => {
      const notification = draft.data.find(
        (n: { id: string }) => n.id === data.notificationId,
      );
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData(
      (draft: { data: { isRead: boolean; readAt: string }[] }) => {
        draft.data.forEach(
          (notification: { isRead: boolean; readAt: string }) => {
            notification.isRead = true;
            notification.readAt = new Date().toISOString();
          },
        );
      },
    );
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
    updateCachedData((draft: { data: { count: number } }) => {
      const audio = new Audio("/notif.mp3");
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      draft.data.count += 1;
    });
  };

  const handleNotificationRead = () => {
    updateCachedData((draft: { data: { count: number } }) => {
      if (draft.data.count > 0) {
        draft.data.count -= 1;
      }
    });
  };

  const handleAllNotificationsRead = () => {
    updateCachedData((draft: { data: { count: number } }) => {
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
