import { PageMeta } from "./types";

export const DEFAULT_META: PageMeta = {
  title: "Inuko token",
};

export const customMeta: { [key: string]: PageMeta } = {
  "/": {
    title: "Home | Inuko token",
  },
  "/competition": {
    title: "Trading Battle | Inuko token",
  },
  "/prediction": {
    title: "Prediction | Inuko token",
  },
  "/farms": {
    title: "Farms | Inuko token",
  },
  "/pools": {
    title: "Pools | Inuko token",
  },
  "/lottery": {
    title: "Lottery | Inuko token",
  },
  "/collectibles": {
    title: "Collectibles | Inuko token",
  },
  "/ifo": {
    title: "Initial Farm Offering | Inuko token",
  },
  "/teams": {
    title: "Leaderboard | Inuko token",
  },
  "/profile/tasks": {
    title: "Task Center | Inuko token",
  },
  "/profile": {
    title: "Your Profile | Inuko token",
  },
};
