import { CategoryActions } from "@keyboom/contracts/client";
import { ERD } from "../api.type";

export type Categories = ERD<CategoryActions["readMany"]>;
export type Category = ERD<CategoryActions["readMany"]>[number];
