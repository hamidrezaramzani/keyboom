import { NotificationActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { NOTIFICATION_ENDPOINTS } from "./api-notification.constant";
import {
  handleOnCacheEntryAdded,
  handleOnCacheEntryCountAdded,
} from "./api-notification.on-cache";

export const notificationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationActions["getMany"]["response"]["ok"],
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.base,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryAdded,
    }),
    getRecentNotifications: builder.query<
      NotificationActions["getRecent"]["response"]["ok"]["data"],
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.recent,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryAdded,
    }),
    getUnreadCount: builder.query<
      NotificationActions["getUnreadCount"]["response"]["ok"]['data'],
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.unreadCount,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryCountAdded,
    }),
    markAsRead: builder.mutation<
      NotificationActions["markAsRead"]["response"]["ok"],
      { id: string }
    >({
      query: ({ id }) => ({
        url: NOTIFICATION_ENDPOINTS.markAsRead(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation<
      NotificationActions["markAllAsRead"]["response"]["ok"],
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.markAllAsRead,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetRecentNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationEndpoints;
