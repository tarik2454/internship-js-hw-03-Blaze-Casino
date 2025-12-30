import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import type { GameState, UseRocketGameReturn } from "../types";
import { useUserStats } from "../../../hooks/useUserStats";

export const useRocketGame = (): UseRocketGameReturn => {
  const { balance, updateStats } = useUserStats();
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [lastWin, setLastWin] = useState(0);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [gameResult, setGameResult] = useState<number | null>(null);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    if (balance < betAmount) return toast.warning("Insufficient balance!");

    setGameResult(null);

    const crashPoint = 1 + Math.pow(Math.random(), 2) * 9;
    updateStats(-betAmount, {
      totalWagered: betAmount,
      gamesPlayed: 1,
    });

    setGameState("FLYING");
    setMultiplier(1);
    setLastWin(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + Math.pow(elapsed, 2) * 0.1;

      if (currentMultiplier >= crashPoint) {
        setGameState("CRASHED");
        setMultiplier(crashPoint);
        setGameResult(-betAmount);
        return;
      }

      setMultiplier(currentMultiplier);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleCashOut = (finalMultiplier: number) => {
    cancelAnimationFrame(requestRef.current);
    const winAmount = betAmount * finalMultiplier;
    updateStats(winAmount, {
      totalWon: winAmount,
    });
    const profit = winAmount - betAmount;
    setLastWin(winAmount);
    setMultiplier(finalMultiplier);
    setGameState("CASHOUT");
    setGameResult(profit);
  };

  const cashOut = () => {
    if (gameState === "FLYING") handleCashOut(multiplier);
  };

  useEffect(() => () => cancelAnimationFrame(requestRef.current), []);

  const isGameActive = gameState === "FLYING";

  return {
    betAmount,
    multiplier,
    lastWin,
    gameState,
    gameResult,
    isGameActive,
    setBetAmount,
    startGame,
    cashOut,
    setGameResult,
  };
};

