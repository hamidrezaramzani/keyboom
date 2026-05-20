import { DashboardActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { DASHBOARD_ENDPOINTS } from "./api-dashboard.constant";
import { transformResponse } from "../api.helper";

export const dashboardEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<
      ERD<DashboardActions["getDashboard"]>,
      QueryArgsNew<DashboardActions["getDashboard"]>
    >({
      query: ({ params }) => ({
        url: DASHBOARD_ENDPOINTS.getDashboard(params.range),
        method: "GET",
      }),
      providesTags: ["Dashboard"],
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardQuery } = dashboardEndpoints;
