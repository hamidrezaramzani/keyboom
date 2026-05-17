import { SubscriptionActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Subscription = ERD<SubscriptionActions["create"]>;
export type SubscriptionReport = ERD<SubscriptionActions["getReport"]>;
export type MonthlyCostData = SubscriptionReport["costOverTime"][0];
export type PeriodDetail = SubscriptionReport["costOverTime"][0]["periods"][0];
