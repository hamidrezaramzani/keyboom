import { WorkspaceActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { RequestParams } from "../api.type";
import { WORKSPACE_ENDPOINTS } from "./api-workspace.constant";

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
  }),
  overrideExisting: false,
});

export const {
  useReadManyWorkspacesQuery,
  useCreateWorkspaceMutation,
  useUpdateCurrentWorkspaceMutation,
} = workspaceEndpoints;
