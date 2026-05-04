import { WorkspaceActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { RequestParams } from "../api.type";
import { WORKSPACE_ENDPOINTS } from "./api-workspace.constant";
import { handleWorkspaceCacheUpdate } from "./api-workspace.on-cache";

export const workspaceEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      WorkspaceActions["create"]["response"]["ok"],
      RequestParams<
        WorkspaceActions["create"]["payload"],
        WorkspaceActions["create"]["payload"]
      >
    >({
      query: ({ payload }) => {
        console.log("payload", payload);
        return {
          url: WORKSPACE_ENDPOINTS.create,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Workspace"],
    }),
    readManyWorkspaces: builder.query<
      WorkspaceActions["readMany"]["response"]["ok"],
      RequestParams<WorkspaceActions["readMany"]["payload"], void>
    >({
      query: () => ({
        url: WORKSPACE_ENDPOINTS.readMany,
        method: "GET",
      }),
      providesTags: ["Workspace"],
      onCacheEntryAdded: async (
        _arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved },
      ) => {
        await cacheDataLoaded;

        const cleanup = handleWorkspaceCacheUpdate(updateCachedData);

        await cacheEntryRemoved;

        cleanup();
      },
    }),
    updateCurrentWorkspace: builder.mutation<
      WorkspaceActions["updateCurrent"]["response"]["ok"],
      RequestParams<
        WorkspaceActions["updateCurrent"]["payload"],
        WorkspaceActions["updateCurrent"]["payload"]
      >
    >({
      query: ({ payload }) => ({
        url: WORKSPACE_ENDPOINTS.updateCurrent,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Workspace"],
    }),
    updateWorkspaceSetting: builder.mutation<
      WorkspaceActions["updateSetting"]["response"]["ok"],
      RequestParams<
        WorkspaceActions["updateSetting"]["payload"],
        WorkspaceActions["updateSetting"]["params"]
      >
    >({
      query: ({ payload, params }) => ({
        url: WORKSPACE_ENDPOINTS.updateSettings(params),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Workspace"],
    }),

    getWorkspaceMembers: builder.query<
      WorkspaceActions["readManyMembers"]["response"]["ok"],
      RequestParams<void, WorkspaceActions["readManyMembers"]["params"]>
    >({
      query: ({ params }) => ({
        url: WORKSPACE_ENDPOINTS.readManyMembers(params?.workspaceId || ""),
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWorkspaceMutation,
  useReadManyWorkspacesQuery,
  useGetWorkspaceMembersQuery,
  useUpdateCurrentWorkspaceMutation,
  useUpdateWorkspaceSettingMutation,
} = workspaceEndpoints;
