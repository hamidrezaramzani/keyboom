import { SubscriptionPeriodActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { SUBSCRIPTION_PERIOD_ENDPOINTS } from "./api-subscription-period.constant";
import { transformResponse } from "../api.helper";

export const subscriptionPeriodEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPeriod: builder.mutation<
      ERD<SubscriptionPeriodActions["create"]>,
      QueryArgsNew<SubscriptionPeriodActions["create"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_PERIOD_ENDPOINTS.create(params.subscriptionId),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscription"],
      transformResponse,
    }),
    getPeriods: builder.query<
      ERD<SubscriptionPeriodActions["readMany"]>,
      QueryArgsNew<SubscriptionPeriodActions["readMany"]>
    >({
      query: ({ params }) => ({
        url: SUBSCRIPTION_PERIOD_ENDPOINTS.readMany(params.subscriptionId),
        method: "GET",
      }),
      providesTags: ["Subscription"],
      transformResponse,
    }),
    updatePeriod: builder.mutation<
      ERD<SubscriptionPeriodActions["update"]>,
      QueryArgsNew<SubscriptionPeriodActions["update"]>
    >({
      query: ({ params, payload }) => ({
        url: SUBSCRIPTION_PERIOD_ENDPOINTS.update(
          params.subscriptionId,
          params.periodId,
        ),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Subscription"],
      transformResponse,
    }),
    deletePeriod: builder.mutation<
      ERD<SubscriptionPeriodActions["delete"]>,
      QueryArgsNew<SubscriptionPeriodActions["delete"]>
    >({
      query: ({ params }) => ({
        url: SUBSCRIPTION_PERIOD_ENDPOINTS.delete(
          params.subscriptionId,
          params.periodId,
        ),
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
      transformResponse,
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreatePeriodMutation,
  useGetPeriodsQuery,
  useUpdatePeriodMutation,
  useDeletePeriodMutation,
} = subscriptionPeriodEndpoints;
