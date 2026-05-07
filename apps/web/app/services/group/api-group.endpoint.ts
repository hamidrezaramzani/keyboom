import { GroupActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { GROUP_ENDPOINTS } from "./api-group.constant";
import { transformResponse } from "../api.helper";

export const groupEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<
      ERD<GroupActions["create"]>,
      QueryArgsNew<GroupActions["create"]>
    >({
      query: ({ payload }) => ({
        url: GROUP_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
    getGroups: builder.query<
      ERD<GroupActions["readMany"]>,
      QueryArgsNew<GroupActions["readMany"]>
    >({
      query: ({ params }) => ({
        url: GROUP_ENDPOINTS.readMany(params.workspaceId),
        method: "GET",
      }),
      providesTags: ["Group"],
      transformResponse,
    }),
    updateGroup: builder.mutation<
      ERD<GroupActions["update"]>,
      QueryArgsNew<GroupActions["update"]>
    >({
      query: ({ params, payload }) => ({
        url: GROUP_ENDPOINTS.update(params.groupId),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
    reorderGroups: builder.mutation<
      ERD<GroupActions["reorder"]>,
      QueryArgsNew<GroupActions["reorder"]>
    >({
      query: ({ payload }) => ({
        url: GROUP_ENDPOINTS.reorder,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
    archiveGroup: builder.mutation<
      ERD<GroupActions["archive"]>,
      QueryArgsNew<GroupActions["archive"]>
    >({
      query: ({ params }) => ({
        url: GROUP_ENDPOINTS.archive(params.groupId),
        method: "PATCH",
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
    restoreGroup: builder.mutation<
      ERD<GroupActions["restore"]>,
      QueryArgsNew<GroupActions["restore"]>
    >({
      query: ({ params }) => ({
        url: GROUP_ENDPOINTS.restore(params.groupId),
        method: "PATCH",
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
    deleteGroup: builder.mutation<
      ERD<GroupActions["delete"]>,
      QueryArgsNew<GroupActions["delete"]>
    >({
      query: ({ params }) => ({
        url: GROUP_ENDPOINTS.delete(params.groupId),
        method: "DELETE",
        body: params.moveToGroupId
          ? { moveToGroupId: params.moveToGroupId }
          : undefined,
      }),
      invalidatesTags: ["Group"],
      transformResponse,
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useUpdateGroupMutation,
  useReorderGroupsMutation,
  useArchiveGroupMutation,
  useRestoreGroupMutation,
  useDeleteGroupMutation,
} = groupEndpoints;
