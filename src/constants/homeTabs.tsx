import { lazy } from "react";

export const GameRocket = lazy(() =>
  import("../modules/rocket/GameRocket").then((module) => ({
    default: module.GameRocket,
  })),
);

export const GameCases = lazy(() =>
  import("../modules/cases/GameCases").then((module) => ({
    default: module.GameCases,
  })),
);

export const Mines = lazy(() =>
  import("../modules/mines/Mines").then((module) => ({
    default: module.Mines,
  })),
);

export const GamePlinko = lazy(() =>
  import("../modules/plinko/GamePlinko").then((module) => ({
    default: module.GamePlinko,
  })),
);

export const homeTabs = [
  {
    id: "rocket" as const,
    label: "🚀 Rocket",
    Component: GameRocket,
  },
  {
    id: "cases" as const,
    label: "📦 Cases",
    Component: GameCases,
  },
  {
    id: "mines" as const,
    label: "💣 Mines",
    Component: Mines,
  },
  {
    id: "plinko" as const,
    label: "🕹️ Plinko",
    Component: GamePlinko,
  },
];
