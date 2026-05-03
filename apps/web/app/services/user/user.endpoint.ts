import { UserActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { RequestParams } from "../api.type";
import { USER_ENDPOINTS } from "./user.constant";
import { ERD } from "./user.type";

export const userEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      UserActions["registerUser"]["response"],
      RequestParams<UserActions["registerUser"]["payload"], void>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.register,
        method: "POST",
        body: payload,
      }),
    }),
    loginUser: builder.mutation<
      UserActions["loginUser"]["response"],
      RequestParams<UserActions["loginUser"]["payload"], void>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.login,
        method: "POST",
        body: payload,
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: USER_ENDPOINTS.logout,
        method: "POST",
      }),
    }),
    getMe: builder.query<ERD<UserActions["getMe"]["response"]>, void>({
      query: () => ({
        url: USER_ENDPOINTS.getMe,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
} = userEndpoints;
