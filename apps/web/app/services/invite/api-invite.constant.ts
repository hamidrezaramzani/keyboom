export const INVITATION_ENDPOINTS = {
  create: "/invitations",
  getWorkspaceInvitations: (workspaceId: string) =>
    `/invitations/workspace/${workspaceId}`,
  incoming: "/invitations/incoming",
  respond: (id: string) => `/invitations/${id}/respond`,
};
