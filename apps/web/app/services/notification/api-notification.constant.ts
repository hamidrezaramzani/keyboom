export const NOTIFICATION_ENDPOINTS = {
  base: "/notifications",
  recent: "/notifications/recent",
  unreadCount: "/notifications/unread/count",
  markAsRead: (id: string) => `/notifications/${id}/read`,
  markAllAsRead: "/notifications/read-all",
};
