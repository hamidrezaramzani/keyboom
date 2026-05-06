import { NotificationActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { NOTIFICATION_ENDPOINTS } from "./api-notification.constant";
import {
  handleOnCacheEntryAdded,
  handleOnCacheEntryCountAdded,
} from "./api-notification.on-cache";
import { ERD } from "../api.type";
import { transformResponse } from "../api.helper";

export const notificationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ERD<NotificationActions["getMany"]>, void>({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.base,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryAdded,
      transformResponse
    }),
    getRecentNotifications: builder.query<
      ERD<NotificationActions["getRecent"]>,
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.recent,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryAdded,
      transformResponse
    }),
    getUnreadCount: builder.query<
      ERD<NotificationActions["getUnreadCount"]>,
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.unreadCount,
        method: "GET",
      }),
      providesTags: ["Notification"],
      onCacheEntryAdded: handleOnCacheEntryCountAdded,
      transformResponse
    }),
    markAsRead: builder.mutation<
      ERD<NotificationActions["markAsRead"]>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: NOTIFICATION_ENDPOINTS.markAsRead(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
      transformResponse
    }),
    markAllAsRead: builder.mutation<
      ERD<NotificationActions["markAllAsRead"]>,
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.markAllAsRead,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
      transformResponse
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetRecentNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationEndpoints;
