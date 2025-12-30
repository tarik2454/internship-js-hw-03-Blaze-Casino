import { useState, useCallback } from "react";
import type { GameStatus, CellStatus, UseMinesGameReturn } from "../types";

const GRID_SIZE = 25;
const HOUSE_EDGE = 0.97;

export const useMinesGame = (): UseMinesGameReturn => {
  const [gameState, setGameState] = useState<GameStatus>("IDLE");
  const [cells, setCells] = useState<CellStatus[]>(
    Array(GRID_SIZE).fill("hidden"),
  );
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [revealedCount, setRevealedCount] = useState<number>(0);

  const calculateMultiplier = (mines: number, revealed: number): number => {
    const safeSpots = GRID_SIZE - mines;
    let multiplier = 1;

    for (let i = 0; i < revealed; i++) {
      multiplier *= (GRID_SIZE - i) / (safeSpots - i);
    }

    if (revealed === 0) return 1;

    return multiplier * HOUSE_EDGE;
  };

  const startGame = useCallback(() => {
    const newMinePositions = new Set<number>();
    while (newMinePositions.size < minesCount) {
      newMinePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    setMinePositions(Array.from(newMinePositions));
    setCells(Array(GRID_SIZE).fill("hidden"));
    setRevealedCount(0);
    setGameState("PLAYING");
  }, [minesCount]);

  const handleCashOut = useCallback(() => {
    if (gameState !== "PLAYING") return;
    setGameState("WON");
    const newCells = [...cells];
    minePositions.forEach((pos) => {
      newCells[pos] = "mine";
    });
    setCells(newCells);
  }, [gameState, cells, minePositions]);

  const revealTile = useCallback(
    (index: number) => {
      if (gameState !== "PLAYING" || cells[index] !== "hidden") return;

      if (minePositions.includes(index)) {
        const newCells = [...cells];
        newCells[index] = "mine";
        minePositions.forEach((pos) => {
          newCells[pos] = "mine";
        });
        setCells(newCells);
        setGameState("LOST");
      } else {
        const newCells = [...cells];
        newCells[index] = "gem";
        const newRevealedCount = revealedCount + 1;

        if (newRevealedCount === GRID_SIZE - minesCount) {
          setGameState("WON");
          minePositions.forEach((pos) => {
            newCells[pos] = "mine";
          });
        }

        setCells(newCells);
        setRevealedCount(newRevealedCount);
      }
    },
    [gameState, cells, minePositions, revealedCount, minesCount],
  );

  const resetGame = useCallback(() => {
    setGameState("IDLE");
    setCells(Array(GRID_SIZE).fill("hidden"));
    setRevealedCount(0);
  }, []);

  const currentMultiplier = calculateMultiplier(minesCount, revealedCount);
  const nextMultiplier = calculateMultiplier(minesCount, revealedCount + 1);
  const currentValue = betAmount * currentMultiplier;

  return {
    gameState,
    cells,
    betAmount,
    setBetAmount,
    minesCount,
    setMinesCount,
    startGame,
    revealTile,
    cashOut: handleCashOut,
    resetGame,
    currentMultiplier,
    nextMultiplier,
    currentValue,
    revealedCount,
  };
};
