import { WorkspaceActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { RequestParams } from "../api.type";
import { WORKSPACE_ENDPOINTS } from "./api-workspace.constant";

export const workspaceEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    readManyWorkspaces: builder.query<
      WorkspaceActions["readMany"]["response"]["ok"],
      RequestParams<WorkspaceActions["readMany"]["payload"], void>
    >({
      query: () => ({
        url: WORKSPACE_ENDPOINTS.readMany,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useReadManyWorkspacesQuery } = workspaceEndpoints;
