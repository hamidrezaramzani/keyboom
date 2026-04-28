import { CardVariant } from "./card.type";

export const variants: Record<CardVariant, string> = {
  default:
    "bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800",
  gradient:
    "bg-gradient-to-b from-indigo-600/10 to-gray-900 border border-indigo-500/30 rounded-2xl p-6",
  hover:
    "bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300",
};
