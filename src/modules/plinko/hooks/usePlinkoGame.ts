import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { RISK_ORDER, BALS, DEFAULT_SETTINGS } from "../constants/constants";
import type {
  PlinkoSettings,
  PlinkoHistoryItem,
  DropResult,
  UsePlinkoGameReturn,
} from "../types";
import {
  loadSettings,
  saveSettings,
  saveHistory,
  loadHistory,
} from "../utils/settingsStorage";
import { getMultipliers } from "../utils/getMultipliers";
import { usePlinkoCanvas } from "./usePlinkoCanvas";
import { useUserStats } from "../../../hooks/useUserStats";

export const usePlinkoGame = (): UsePlinkoGameReturn => {
  const [settings, setSettings] = useState<PlinkoSettings>(() => {
    const saved = loadSettings();
    return saved || DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<PlinkoHistoryItem[]>(() => {
    return loadHistory();
  });

  const [lastResult, setLastResult] = useState<{
    profit: number;
    totalPayout: number;
    timestamp: number;
  } | null>(null);

  const { updateStats, balance } = useUserStats();

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const changeRisk = (direction: -1 | 1) => {
    setSettings((current) => {
      const index = RISK_ORDER.indexOf(current.risk);
      const nextIndex =
        (index + direction + RISK_ORDER.length) % RISK_ORDER.length;
      return {
        ...current,
        risk: RISK_ORDER[nextIndex],
      };
    });
  };

  const selectBalls = (quantity: number) => {
    setSettings((current) => ({
      ...current,
      balls: quantity,
    }));
  };

  const selectLines = (lines: number) => {
    setSettings((current) => ({
      ...current,
      lines,
    }));
  };

  const selectedBall = BALS.find((ball) => ball.quantity === settings.balls);
  const totalCost = selectedBall ? selectedBall.cost : 0;
  const BALL_PRICE = 2;

  const multipliers = getMultipliers(settings.risk, settings.lines);

  const currentDropResultsRef = useRef<DropResult[]>([]);

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: settings.lines,
    multipliers,
    onBallFinish: (ball) => {
      const result: DropResult = {
        multiplier: ball.multiplier,
        payout: ball.payout,
        slotIndex: ball.slotIndex,
      };

      currentDropResultsRef.current = [
        ...currentDropResultsRef.current,
        result,
      ];

      if (currentDropResultsRef.current.length === settings.balls) {
        const historyItem: PlinkoHistoryItem = {
          id: `drop_${Date.now()}`,
          timestamp: new Date().toISOString(),
          bet: BALL_PRICE,
          balls: settings.balls,
          risk: settings.risk,
          lines: settings.lines,
          results: [...currentDropResultsRef.current],
        };

        setHistory((prevHistory) => {
          const newHistory = [historyItem, ...prevHistory];
          return newHistory.slice(0, 20);
        });

        const totalPayout = currentDropResultsRef.current.reduce(
          (sum, r) => sum + r.payout,
          0,
        );

        const profit = totalPayout - totalCost;
        updateStats(totalPayout, {
          totalWon: profit > 0 ? profit : 0,
        });

        setLastResult({
          profit,
          totalPayout,
          timestamp: Date.now(),
        });

        currentDropResultsRef.current = [];
      }
    },
  });

  const dropBalls = () => {
    if (balance < totalCost) {
      return toast.warning("Insufficient balance!");
    }

    setLastResult(null);

    updateStats(-totalCost, {
      totalWagered: totalCost,
      gamesPlayed: 1,
    });

    currentDropResultsRef.current = [];

    for (let i = 0; i < settings.balls; i++) {
      setTimeout(() => {
        addBall(BALL_PRICE);
      }, i * 300);
    }
  };

  return {
    settings,
    history,
    lastResult,
    totalCost,
    canvasRef,
    changeRisk,
    selectBalls,
    selectLines,
    dropBalls,
    setLastResult,
  };
};
