import { useEffect, useRef, useCallback } from "react";
import { getMultiplierColor } from "../utills/getMultiplierColor";

interface Ball {
  path: number[];
  currentStep: number;
  progress: number;
  row: number;
  col: number;
  multiplier: number;
  payout: number;
  slotIndex: number;
  finished: boolean;
  highlightSlot: boolean;
  finishTime?: number;
  betAmount: number;
  speed: number;
}

interface UsePlinkoCanvasProps {
  lines: number;
  multipliers: number[];
  onBallFinish?: (ball: Ball) => void;
}

export const usePlinkoCanvas = ({
  lines,
  multipliers,
  onBallFinish,
}: UsePlinkoCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeBallsRef = useRef<Ball[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const generatePath = useCallback((lines: number): number[] => {
    const path: number[] = [];

    for (let i = 0; i < lines; i++) {
      const direction = Math.random() < 0.5 ? 0 : 1;
      path.push(direction);
    }

    return path;
  }, []);

  const addBall = useCallback(
    (betAmount: number) => {
      const path = generatePath(lines);

      let finalCol = 0;
      path.forEach((dir) => {
        finalCol += dir;
      });

      const slotIndex = finalCol;

      const safeSlotIndex = Math.max(
        0,
        Math.min(multipliers.length - 1, slotIndex),
      );
      const multiplier = multipliers[safeSlotIndex];
      const payout = multiplier * betAmount;

      const ball: Ball = {
        path,
        currentStep: 0,
        progress: 0,
        row: 0,
        col: 0,
        multiplier,
        payout,
        slotIndex: safeSlotIndex,
        finished: false,
        highlightSlot: false,
        betAmount,
        speed: 0.15,
      };

      activeBallsRef.current = [...activeBallsRef.current, ball];
    },
    [lines, multipliers, generatePath],
  );

  const renderBoard = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      ctx.fillStyle = "#ffffff";
      const startY = 50;
      const spacing = 30;

      for (let i = 0; i <= lines; i++) {
        for (let j = 0; j <= i; j++) {
          const x = width / 2 + (j - i / 2) * spacing;
          const y = startY + i * spacing;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [lines],
  );

  const getSlotColor = (multiplier: number): string => {
    return getMultiplierColor(multiplier);
  };

  const renderSlots = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      if (multipliers.length === 0) return;

      const startY = 50;
      const spacing = 30;
      const slotY = startY + (lines + 1) * spacing + 10;
      const slotHeight = 45;

      const slotWidth = spacing - 4;

      multipliers.forEach((multiplier, index) => {
        const centerX = width / 2 + (index - lines / 2) * spacing;
        const x = centerX - spacing / 2 + 2;

        const color = getSlotColor(multiplier);

        ctx.fillStyle = color;
        ctx.fillRect(x, slotY, slotWidth, slotHeight);

        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";
        if (multiplier >= 10) ctx.font = "bold 11px Arial";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const formattedMultiplier =
          multiplier % 1 === 0 ? multiplier.toString() : multiplier.toFixed(1);

        ctx.fillText(
          formattedMultiplier + "x",
          centerX,
          slotY + slotHeight / 2,
        );
      });
    },
    [lines, multipliers],
  );

  const updateAndDrawBalls = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      const startY = 50;
      const spacing = 30;
      const slotY = startY + (lines + 1) * spacing + 10;
      const slotHeight = 45;

      const balls = activeBallsRef.current;

      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        if (ball.finished && ball.finishTime) {
          if (Date.now() - ball.finishTime > 2000) {
            balls.splice(i, 1);
            continue;
          }
        }

        if (!ball.finished) {
          ball.progress += 0.08;

          if (ball.progress >= 1) {
            ball.progress = 0;
            ball.currentStep++;

            if (ball.currentStep >= ball.path.length) {
              ball.finished = true;
              ball.highlightSlot = true;
              ball.finishTime = Date.now();

              setTimeout(() => {
                if (onBallFinish) {
                  onBallFinish(ball);
                }
              }, 2000);
            } else {
              ball.row++;
              const direction = ball.path[ball.currentStep];
              ball.col += direction;
            }
          }
        }
      }

      balls.forEach((ball) => {
        const currentPathIndex = ball.currentStep;

        let startCol = 0;
        for (let k = 0; k < currentPathIndex; k++) {
          startCol += ball.path[k];
        }

        let endCol = startCol;
        if (currentPathIndex < ball.path.length) {
          endCol += ball.path[currentPathIndex];
        }

        const t = ball.progress;
        const renderRow = currentPathIndex + t;
        const renderCol = startCol + (endCol - startCol) * t;

        const y = startY + renderRow * spacing;
        const x = width / 2 + (renderCol - renderRow / 2) * spacing;

        if (ball.currentStep >= ball.path.length) {
          const index = ball.slotIndex;
          const centerX = width / 2 + (index - lines / 2) * spacing;
          const slotYCenter = slotY + slotHeight / 2;

          if (ball.highlightSlot) {
            const sx = centerX - spacing / 2 + 2;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(sx - 2, slotY - 2, spacing, slotHeight + 4);

            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            const text = `+$${ball.payout.toFixed(2)}`;
            ctx.fillText(text, centerX, slotY - 20);
          }

          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(centerX, slotYCenter, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(x, y - 5, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    [lines, onBallFinish],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      renderBoard(ctx, width);
      renderSlots(ctx, width);
      updateAndDrawBalls(ctx, width);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lines, multipliers, renderBoard, renderSlots, updateAndDrawBalls]);

  return {
    canvasRef,
    addBall,
  };
};
