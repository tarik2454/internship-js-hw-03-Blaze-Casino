import { useEffect, useRef, useCallback } from "react";
import { getMultiplierColor } from "../utils/getMultiplierColor";
import type { Ball, UsePlinkoCanvasProps } from "../types";

export const usePlinkoCanvas = ({
  lines,
  multipliers,
  onBallFinish,
}: UsePlinkoCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeBallsRef = useRef<Ball[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isAnimatingRef = useRef<boolean>(false);

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
        bounceStrength: 0.2 + Math.random() * 0.1,
      };

      activeBallsRef.current = [...activeBallsRef.current, ball];
      
      if (!isAnimatingRef.current) {
        startAnimation();
      }
    },
    [lines, multipliers, generatePath],
  );

  const renderBoard = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = "#ffffff";
      const spacing = 50;
      const slotY = height - 100;
      const startY = slotY - (lines + 1) * spacing - 10;

      for (let i = 0; i <= lines; i++) {
        for (let j = 0; j <= i; j++) {
          const x = width / 2 + (j - i / 2) * spacing;
          const y = startY + i * spacing;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
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
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (multipliers.length === 0) return;

      const spacing = 50;
      const slotY = height - 100;
      const slotHeight = 48;
      const radius = 4;
      const slotWidth = spacing - 2;

      multipliers.forEach((multiplier, index) => {
        const centerX = width / 2 + (index - lines / 2) * spacing;
        const x = centerX - spacing / 2 + 2;

        const color = getSlotColor(multiplier);

        ctx.fillStyle = color;

        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, slotY, slotWidth, slotHeight, radius);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(x + radius, slotY);
          ctx.lineTo(x + slotWidth - radius, slotY);

          ctx.quadraticCurveTo(
            x + slotWidth,
            slotY,
            x + slotWidth,
            slotY + radius,
          );

          ctx.lineTo(x + slotWidth, slotY + slotHeight - radius);

          ctx.quadraticCurveTo(
            x + slotWidth,
            slotY + slotHeight,
            x + slotWidth - radius,
            slotY + slotHeight,
          );

          ctx.lineTo(x + radius, slotY + slotHeight);

          ctx.quadraticCurveTo(
            x,
            slotY + slotHeight,
            x,
            slotY + slotHeight - radius,
          );

          ctx.lineTo(x, slotY + radius);

          ctx.quadraticCurveTo(x, slotY, x + radius, slotY);
          ctx.closePath();
          ctx.fill();
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px Inter";
        if (multiplier >= 10) ctx.font = "bold 16px Inter";

        ctx.textAlign = "center";
        ctx.textBaseline = "hanging";
        const formattedMultiplier =
          multiplier % 1 === 0 ? multiplier.toString() : multiplier.toFixed(1);

        const textY = slotY + slotHeight / 2 + -6;
        ctx.fillText(formattedMultiplier, centerX, textY);
      });
    },
    [lines, multipliers],
  );

  const updateAndDrawBalls = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const spacing = 50;
      const slotY = height - 100;
      const startY = slotY - (lines + 1) * spacing - 10;
      const slotHeight = 48;

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
          ball.progress += 0.05;

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

        const renderCol = startCol + (endCol - startCol) * t;

        const bounce = ball.bounceStrength || 0.25;
        const verticalProgress = t * t * (1 + bounce) - t * bounce;
        const renderRow = currentPathIndex + verticalProgress;

        const y = startY + renderRow * spacing;
        const x = width / 2 + (renderCol - renderRow / 2) * spacing;

        if (ball.currentStep >= ball.path.length) {
          const index = ball.slotIndex;
          const centerX = width / 2 + (index - lines / 2) * spacing;
          const slotYCenter = slotY + slotHeight / 2;

          if (ball.highlightSlot) {
            const slotWidth = spacing - 2;
            const sx = centerX - slotWidth / 2;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(sx - 2, slotY - 2, slotWidth + 4, slotHeight + 4);

            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            const text = `+$${ball.payout.toFixed(2)}`;
            ctx.fillText(text, centerX, slotY - 20);
          }

          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(centerX, slotYCenter, 9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(x, y - 5, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    [lines, onBallFinish],
  );

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const animate = () => {
      const balls = activeBallsRef.current;
      
      if (balls.length === 0) {
        ctx.clearRect(0, 0, width, height);
        renderBoard(ctx, width, height);
        renderSlots(ctx, width, height);
        isAnimatingRef.current = false;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);
      renderBoard(ctx, width, height);
      renderSlots(ctx, width, height);
      updateAndDrawBalls(ctx, width, height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [renderBoard, renderSlots, updateAndDrawBalls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    renderBoard(ctx, width, height);
    renderSlots(ctx, width, height);

    if (activeBallsRef.current.length > 0 && !isAnimatingRef.current) {
      startAnimation();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      isAnimatingRef.current = false;
    };
  }, [lines, multipliers, renderBoard, renderSlots, startAnimation]);

  return {
    canvasRef,
    addBall,
  };
};
