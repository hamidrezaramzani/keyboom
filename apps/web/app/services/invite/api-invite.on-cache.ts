import { getSocket } from "../socket";
import { ERD } from "../api.type";
import { InvitationActions } from "@keyboom/contracts/client";

export const handleInviteCacheEntryAdded = async (
  _arg: void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleInviteCreated = (data: {
    invite: ERD<InvitationActions["readMany"]>["pending"][number];
  }) => {
    updateCachedData((draft: ERD<InvitationActions["readMany"]>) => {
      draft.pending.unshift(data.invite);
    });
  };

  const handleInviteAccepted = (data: { inviteId: string; userId: string }) => {
    updateCachedData((draft: ERD<InvitationActions["readMany"]>) => {
      const invite = draft.pending.find((i) => i.id === data.inviteId);
      if (invite) {
        invite.status = "accepted";
        draft.pending = draft.pending.filter((i) => i.id !== data.inviteId);
        draft.history.unshift(invite);
      }
    });
  };

  const handleInviteRejected = (data: { inviteId: string }) => {
    updateCachedData((draft: ERD<InvitationActions["readMany"]>) => {
      const invite = draft.pending.find((i) => i.id === data.inviteId);
      if (invite) {
        invite.status = "rejected";
        draft.pending = draft.pending.filter((i) => i.id !== data.inviteId);
        draft.history.unshift(invite);
      }
    });
  };

  socket.on("invite:created", handleInviteCreated);
  socket.on("invite:accepted", handleInviteAccepted);
  socket.on("invite:rejected", handleInviteRejected);

  await cacheEntryRemoved;

  socket.off("invite:created", handleInviteCreated);
  socket.off("invite:accepted", handleInviteAccepted);
  socket.off("invite:rejected", handleInviteRejected);
};
