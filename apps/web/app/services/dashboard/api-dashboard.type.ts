import { DashboardActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Dashboard = ERD<DashboardActions["getDashboard"]>;
