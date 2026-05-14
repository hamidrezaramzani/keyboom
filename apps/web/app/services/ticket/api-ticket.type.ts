import { TicketActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Ticket = ERD<TicketActions["readMany"]>[number];
export type TicketMessage = ERD<TicketActions["readOne"]>["messages"][number];
