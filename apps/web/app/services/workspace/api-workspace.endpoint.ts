import { WorkspaceActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { WORKSPACE_ENDPOINTS } from "./api-workspace.constant";
import { ERD, QueryArgsNew } from "../api.type";
import { transformResponse } from "../api.helper";

export const workspaceEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      ERD<WorkspaceActions["create"]>,
      QueryArgsNew<WorkspaceActions["create"]>
    >({
      query: ({ payload }) => ({
        url: WORKSPACE_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Workspace"],
      transformResponse,
    }),
    readManyWorkspaces: builder.query<
      ERD<WorkspaceActions["readMany"]>,
      QueryArgsNew<WorkspaceActions["readMany"]>
    >({
      query: () => ({
        url: WORKSPACE_ENDPOINTS.readMany,
        method: "GET",
      }),
      providesTags: ["Workspace"],
      transformResponse,
    }),
    updateCurrentWorkspace: builder.mutation<
      ERD<WorkspaceActions["updateCurrent"]>,
      QueryArgsNew<WorkspaceActions["updateCurrent"]>
    >({
      query: ({ payload }) => ({
        url: WORKSPACE_ENDPOINTS.updateCurrent,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Workspace"],
      transformResponse,
    }),
    updateWorkspaceSetting: builder.mutation<
      ERD<WorkspaceActions["updateSetting"]>,
      QueryArgsNew<WorkspaceActions["updateSetting"]>
    >({
      query: ({ payload, params }) => ({
        url: WORKSPACE_ENDPOINTS.updateSettings(params),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Workspace"],
      transformResponse,
    }),

    getWorkspaceMembers: builder.query<
      ERD<WorkspaceActions["readManyMembers"]>,
      QueryArgsNew<WorkspaceActions["readManyMembers"]>
    >({
      query: ({ params }) => ({
        url: WORKSPACE_ENDPOINTS.readManyMembers(params.workspaceId),
        method: "GET",
      }),
      transformResponse,
    }),

    leaveWorkspace: builder.mutation<
      ERD<WorkspaceActions["leave"]>,
      QueryArgsNew<WorkspaceActions["leave"]>
    >({
      query: ({ params }) => ({
        url: WORKSPACE_ENDPOINTS.leave(params.workspaceId),
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace", "User"],
    }),

    deleteWorkspace: builder.mutation<
      ERD<WorkspaceActions["delete"]>,
      QueryArgsNew<WorkspaceActions["delete"]>
    >({
      query: ({ params }) => ({
        url: WORKSPACE_ENDPOINTS.delete(params.workspaceId),
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace", "User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateWorkspaceMutation,
  useReadManyWorkspacesQuery,
  useGetWorkspaceMembersQuery,
  useUpdateCurrentWorkspaceMutation,
  useUpdateWorkspaceSettingMutation,
  useDeleteWorkspaceMutation,
  useLeaveWorkspaceMutation,
} = workspaceEndpoints;
