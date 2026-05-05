import { UserActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Me = ERD<UserActions["getMe"]>;
