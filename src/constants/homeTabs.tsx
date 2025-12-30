import { GameRocket } from "../modules/rocket/GameRocket";
import { GameCases } from "../modules/cases/GameCases";
import { Mines } from "../modules/mines/Mines";
import { GamePlinko } from "../modules/plinko/GamePlinko";

export const homeTabs = [
  {
    id: "rocket" as const,
    label: "🚀 Rocket",
    content: <GameRocket />,
  },
  {
    id: "cases" as const,
    label: "📦 Cases",
    content: <GameCases />,
  },
  {
    id: "mines" as const,
    label: "💣 Mines",
    content: <Mines />,
  },
  {
    id: "plinko" as const,
    label: "🕹️ Plinko",
    content: <GamePlinko />,
  },
];
