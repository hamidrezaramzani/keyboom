// client/src/app/services/bale/api-bale.endpoint.ts
import { BaleActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { BALE_ENDPOINTS } from "./api-bale.constant";
import { transformResponse } from "../api.helper";

export const baleEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateCode: builder.mutation<ERD<BaleActions["generateCode"]>, void>({
      query: () => ({
        url: BALE_ENDPOINTS.generateCode,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      transformResponse,
    }),

    verifyCode: builder.mutation<
      ERD<BaleActions["verifyCode"]>,
      QueryArgsNew<BaleActions["verifyCode"]>
    >({
      query: ({ payload }) => ({
        url: BALE_ENDPOINTS.verifyCode,
        method: "POST",
        body: payload,
      }),
      transformResponse,
    }),

    connectBale: builder.mutation<
      ERD<BaleActions["connectBale"]>,
      QueryArgsNew<BaleActions["connectBale"]>
    >({
      query: ({ payload }) => ({
        url: BALE_ENDPOINTS.connect,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
      transformResponse,
    }),

    getBaleStatus: builder.query<ERD<BaleActions["getStatus"]>, void>({
      query: () => ({
        url: BALE_ENDPOINTS.status,
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse,
    }),

    disconnectBale: builder.mutation<ERD<BaleActions["disconnect"]>, void>({
      query: () => ({
        url: BALE_ENDPOINTS.disconnect,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGenerateCodeMutation,
  useVerifyCodeMutation,
  useConnectBaleMutation,
  useGetBaleStatusQuery,
  useDisconnectBaleMutation,
} = baleEndpoints;
