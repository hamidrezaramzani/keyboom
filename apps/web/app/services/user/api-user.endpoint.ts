import { UserActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { QueryArgsNew } from "../api.type";
import { USER_ENDPOINTS } from "./api-user.constant";
import { ERD } from "../api.type";
import { transformResponse } from "../api.helper";

export const userEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      ERD<UserActions["registerUser"]>,
      QueryArgsNew<UserActions["registerUser"]>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.register,
        method: "POST",
        body: payload,
      }),
      transformResponse,
    }),
    loginUser: builder.mutation<
      ERD<UserActions["loginUser"]>,
      QueryArgsNew<UserActions["loginUser"]>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.login,
        method: "POST",
        body: payload,
      }),
      transformResponse,
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: USER_ENDPOINTS.logout,
        method: "POST",
      }),
      transformResponse,
    }),
    getMe: builder.query<ERD<UserActions["getMe"]>, void>({
      query: () => ({
        url: USER_ENDPOINTS.getMe,
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse,
    }),

    updateProfile: builder.mutation<
      ERD<UserActions["updateProfile"]>,
      QueryArgsNew<UserActions["updateProfile"]>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.profile,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<
      ERD<UserActions["changePassword"]>,
      QueryArgsNew<UserActions["changePassword"]>
    >({
      query: ({ payload }) => ({
        url: USER_ENDPOINTS.changePassword,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userEndpoints;
