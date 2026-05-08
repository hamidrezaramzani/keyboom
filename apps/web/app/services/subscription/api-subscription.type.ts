import { SubscriptionActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Subscription = ERD<SubscriptionActions["create"]>;
