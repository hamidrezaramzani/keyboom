import { InvitationActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { INVITATION_ENDPOINTS } from "./api-invite.constant";
import { handleInviteCacheEntryAdded } from "./api-invite.on-cache";
import { ERD, QueryArgsNew } from "../api.type";
import { transformResponse } from "../api.helper";

export const invitationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvitation: builder.mutation<
      ERD<InvitationActions["create"]>,
      QueryArgsNew<InvitationActions["create"]>
    >({
      query: ({ payload }) => ({
        url: INVITATION_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Workspace", "Invitation"],
      transformResponse,
    }),
    getWorkspaceInvitations: builder.query<
      ERD<InvitationActions["getWorkspaceInvitations"]>,
      QueryArgsNew<InvitationActions["getWorkspaceInvitations"]>
    >({
      query: ({ params }) => ({
        url: INVITATION_ENDPOINTS.getWorkspaceInvitations(params.workspaceId),
        method: "GET",
      }),
      providesTags: ["Invitation"],
      transformResponse,
    }),
    getMyInvites: builder.query<ERD<InvitationActions["readMany"]>, void>({
      query: () => ({
        url: INVITATION_ENDPOINTS.readMany,
        method: "GET",
      }),
      providesTags: ["Invitation"],
      transformResponse,
      onCacheEntryAdded: handleInviteCacheEntryAdded,
    }),
    respondInvitation: builder.mutation<
      ERD<InvitationActions["respond"]>,
      QueryArgsNew<InvitationActions["respond"]>
    >({
      query: ({ payload, params }) => ({
        url: INVITATION_ENDPOINTS.respond(params.id),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Invitation", "Workspace"],
      transformResponse,
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateInvitationMutation,
  useGetWorkspaceInvitationsQuery,
  useGetMyInvitesQuery,
  useRespondInvitationMutation,
} = invitationEndpoints;
