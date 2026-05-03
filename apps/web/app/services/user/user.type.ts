import { UserActions } from "@keyboom/contracts/client";

export type Me = UserActions["getMe"]["response"]["ok"]["data"];
export type ERD<T> = {
  status: number;
  data: T;
};
