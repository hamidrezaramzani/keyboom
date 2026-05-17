import { SubscriptionActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { SUBSCRIPTION_ENDPOINTS } from "./api-subscription.constant";
import { transformResponse } from "../api.helper";

export const subscriptionEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      ERD<SubscriptionActions["create"]>,
      QueryArgsNew<SubscriptionActions["create"]>
    >({
      query: ({ payload }) => ({
        url: SUBSCRIPTION_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    updateSubscription: builder.mutation<
      ERD<SubscriptionActions["update"]>,
      QueryArgsNew<SubscriptionActions["update"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_ENDPOINTS.update(params.subscriptionId),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    moveSubscription: builder.mutation<
      ERD<SubscriptionActions["move"]>,
      QueryArgsNew<SubscriptionActions["move"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_ENDPOINTS.move(params.subscriptionId),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    renewSubscription: builder.mutation<
      ERD<SubscriptionActions["renew"]>,
      QueryArgsNew<SubscriptionActions["renew"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_ENDPOINTS.renew(params.subscriptionId),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Group", "Subscription"],
    }),
    cancelSubscription: builder.mutation<
      ERD<SubscriptionActions["cancel"]>,
      QueryArgsNew<SubscriptionActions["cancel"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_ENDPOINTS.cancel(params.subscriptionId),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Group", "Subscription"],
    }),
    deleteSubscription: builder.mutation<
      ERD<SubscriptionActions["delete"]>,
      QueryArgsNew<SubscriptionActions["delete"]>
    >({
      query: ({ params }) => ({
        url: SUBSCRIPTION_ENDPOINTS.delete(params.subscriptionId),
        method: "DELETE",
      }),
      invalidatesTags: ["Group", "Subscription"],
    }),
    getSubscriptionStats: builder.query<
      ERD<SubscriptionActions["getStats"]>,
      QueryArgsNew<SubscriptionActions["getStats"]>
    >({
      query: ({ params }) => ({
        url: SUBSCRIPTION_ENDPOINTS.stats(params.subscriptionId),
        method: "GET",
      }),
      providesTags: ["Subscription"],
      transformResponse,
    }),
    getSubscriptionReport: builder.query<
      ERD<SubscriptionActions["getReport"]>,
      QueryArgsNew<SubscriptionActions["getReport"]>
    >({
      query: ({ params }) => ({
        url: SUBSCRIPTION_ENDPOINTS.report(params.subscriptionId),
        method: "GET",
      }),
      providesTags: ["SubscriptionReport"],
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useMoveSubscriptionMutation,
  useRenewSubscriptionMutation,
  useGetSubscriptionReportQuery,
  useCancelSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionStatsQuery,
} = subscriptionEndpoints;
