import { InvitationActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { INVITATION_ENDPOINTS } from "./api-invite.constant";

export const invitationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvitation: builder.mutation<
      InvitationActions["create"]["response"]["ok"],
      InvitationActions["create"]["payload"]
    >({
      query: (payload) => ({
        url: INVITATION_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Workspace", "Invitation"],
    }),
    getWorkspaceInvitations: builder.query<
      InvitationActions["getWorkspaceInvitations"]["response"]["ok"],
      { workspaceId: string }
    >({
      query: ({ workspaceId }) => ({
        url: INVITATION_ENDPOINTS.getWorkspaceInvitations(workspaceId),
        method: "GET",
      }),
      providesTags: ["Invitation"],
    }),
    getIncomingInvitations: builder.query<
      InvitationActions["getIncoming"]["response"]["ok"],
      void
    >({
      query: () => ({
        url: INVITATION_ENDPOINTS.incoming,
        method: "GET",
      }),
      providesTags: ["Invitation"],
    }),
    respondInvitation: builder.mutation<
      InvitationActions["respond"]["response"]["ok"],
      { id: string; accept: boolean }
    >({
      query: ({ id, accept }) => ({
        url: INVITATION_ENDPOINTS.respond(id),
        method: "POST",
        body: { accept },
      }),
      invalidatesTags: ["Invitation", "Workspace"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateInvitationMutation,
  useGetWorkspaceInvitationsQuery,
  useGetIncomingInvitationsQuery,
  useRespondInvitationMutation,
} = invitationEndpoints;
