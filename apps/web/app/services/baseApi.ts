import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const VALID_ROUTES = ["/login"];
const CURRENT_PATH = window.location.pathname;

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    !VALID_ROUTES.includes(CURRENT_PATH)
  ) {
    api.dispatch({ type: "api/util/resetApiState" });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return result;
};
