import { SubscriptionPeriodActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type SubscriptionPeriod = ERD<SubscriptionPeriodActions["readMany"]>[0];
