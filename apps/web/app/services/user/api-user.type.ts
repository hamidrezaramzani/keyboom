import { UserActions } from "@keyboom/contracts/client";

export type Me = UserActions["getMe"]["response"]["ok"]["data"];
