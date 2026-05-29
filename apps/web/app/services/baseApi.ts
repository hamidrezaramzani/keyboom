"use client";
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

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    
    if (
      result.error &&
      result.error.status === 401 &&
      !VALID_ROUTES.includes(currentPath)
    ) {
      api.dispatch({ type: "api/util/resetApiState" });
      window.location.href = "/login";
    }
  } else {
    if (result.error && result.error.status === 401) {
      api.dispatch({ type: "api/util/resetApiState" });
    }
  }
  
  return result;
};