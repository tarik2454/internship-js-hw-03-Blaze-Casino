import { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { RISK_ORDER, BALS, LINES } from "../constants/constants";
import { handleValidationError } from "../../../utils/errorHandler";
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
import { useUserStats } from "../../../context/useUserStats";
import { validateInRange } from "../../../utils/validation";

export const usePlinkoGame = (): UsePlinkoGameReturn => {
  const [settings, setSettings] = useState<PlinkoSettings>(() => {
    return loadSettings();
  });

  const [history, setHistory] = useState<PlinkoHistoryItem[]>(() => {
    return loadHistory();
  });

  const [lastResult, setLastResult] = useState<{
    profit: number;
    totalPayout: number;
    timestamp: number;
  } | null>(null);

  const { updateStats, balance, deductBetAndUpdateStats } = useUserStats();

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
    try {
      const validQuantities = BALS.map((ball) => ball.quantity);
      validateInRange(quantity, validQuantities, "balls quantity");
      setSettings((current) => ({
        ...current,
        balls: quantity,
      }));
    } catch (error) {
      handleValidationError(error);
    }
  };

  const selectLines = (lines: number) => {
    try {
      const validLines = LINES.map((line) => line.value);
      validateInRange(lines, validLines, "lines count");
      setSettings((current) => ({
        ...current,
        lines,
      }));
    } catch (error) {
      handleValidationError(error);
    }
  };

  const selectedBall = BALS.find((ball) => ball.quantity === settings.balls);
  const totalCost = selectedBall ? selectedBall.cost : 0;
  const BALL_PRICE = 2;

  const multipliers = useMemo(
    () => getMultipliers(settings.risk, settings.lines),
    [settings.risk, settings.lines],
  );

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
    if (!Number.isFinite(totalCost) || totalCost < 0) {
      toast.warning("Invalid total cost");
      return;
    }
    if (balance < totalCost) {
      toast.warning("Insufficient balance!");
      return;
    }
    if (settings.balls < 1) {
      toast.warning("Invalid number of balls");
      return;
    }

    setLastResult(null);

    deductBetAndUpdateStats(totalCost);

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
