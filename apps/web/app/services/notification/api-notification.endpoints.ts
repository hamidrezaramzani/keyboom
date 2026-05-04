import { NotificationActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { NOTIFICATION_ENDPOINTS } from "./api-notification.constant";

export const notificationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationActions["getMany"]["response"]["ok"]['data'],
      void
    >({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.base,
        method: "GET",
      }),
      providesTags: ["Notification"],
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
    }),
    markAsRead: builder.mutation<
      NotificationActions["markAsRead"]["response"]["ok"]['data'],
      { id: string }
    >({
      query: ({ id }) => ({
        url: NOTIFICATION_ENDPOINTS.markAsRead(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation<
      NotificationActions["markAllAsRead"]["response"]["ok"]['data'],
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
