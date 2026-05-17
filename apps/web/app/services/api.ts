import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "User",
    "Workspace",
    "Subscription",
    "SubscriptionReport",
    "Group",
    "Notification",
    "Invitation",
    "Ticket",
  ],
  endpoints: () => ({}),
});
