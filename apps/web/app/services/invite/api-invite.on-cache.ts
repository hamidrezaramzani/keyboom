/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draft } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { ERD } from "../api.type";
import { InvitationActions, WorkspaceActions } from "@keyboom/contracts/client";

export const handleInviteCacheEntryAdded = async (
  _arg: void,
  { cacheDataLoaded, updateCachedData, cacheEntryRemoved }: any,
) => {
  await cacheDataLoaded;

  const socket = await getSocket();

  const handleInviteCreated = (data: { invite: any }) => {
    updateCachedData(
      (
        draft: Draft<
          ERD<InvitationActions["readMany"]["response"]["ok"]["data"]>
        >,
      ) => {
        console.log(data.invite);
        draft.data.pending.unshift(data.invite);
      },
    );
  };

  const handleInviteAccepted = (data: { inviteId: string; userId: string }) => {
    updateCachedData(
      (
        draft: Draft<
          ERD<InvitationActions["readMany"]["response"]["ok"]["data"]>
        >,
      ) => {
        const invite = draft.data.pending.find(
          (i: any) => i.id === data.inviteId,
        );
        if (invite) {
          invite.status = "accepted";
          draft.data.pending = draft.data.pending.filter(
            (i: any) => i.id !== data.inviteId,
          );
          draft.data.history.unshift(invite);
        }
      },
    );
  };

  const handleInviteRejected = (data: { inviteId: string }) => {
    updateCachedData(
      (
        draft: Draft<
          ERD<InvitationActions["readMany"]["response"]["ok"]["data"]>
        >,
      ) => {
        const invite = draft.data.pending.find(
          (i: any) => i.id === data.inviteId,
        );
        if (invite) {
          invite.status = "rejected";
          draft.data.pending = draft.data.pending.filter(
            (i: any) => i.id !== data.inviteId,
          );
          draft.data.history.unshift(invite);
        }
      },
    );
  };

  socket.on("invite:created", handleInviteCreated);
  socket.on("invite:accepted", handleInviteAccepted);
  socket.on("invite:rejected", handleInviteRejected);

  await cacheEntryRemoved;

  socket.off("invite:created", handleInviteCreated);
  socket.off("invite:accepted", handleInviteAccepted);
  socket.off("invite:rejected", handleInviteRejected);
};
