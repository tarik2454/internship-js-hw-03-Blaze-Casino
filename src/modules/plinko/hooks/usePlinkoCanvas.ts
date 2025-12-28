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
  speed: number; // Скорость падения
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

  // Генерация пути для шарика (случайный путь через пины)
  const generatePath = useCallback((lines: number): number[] => {
    const path: number[] = [];

    for (let i = 0; i < lines; i++) {
      // 0 (влево) или 1 (вправо)
      // Это соответствует индексам колонок в треугольнике Паскаля (0..i)
      const direction = Math.random() < 0.5 ? 0 : 1;
      path.push(direction);
    }

    return path;
  }, []);

  // Добавление шарика
  const addBall = useCallback(
    (betAmount: number) => {
      const path = generatePath(lines);

      // Вычисляем финальную логическую позицию (индекс слота)
      // Сумма шагов (0/1) дает точный индекс конечного слота (0..lines)
      let finalCol = 0;
      path.forEach((dir) => {
        finalCol += dir;
      });

      // Индекс слота теперь определяется детерминировано путем
      const slotIndex = finalCol;

      // Получаем множитель из слота, в который попадет шарик
      // Защита от выхода за границы массива (маловероятно при корректной логике)
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
        speed: 0.15, // Немного быстрее скорость
      };

      activeBallsRef.current = [...activeBallsRef.current, ball];
    },
    [lines, multipliers, generatePath],
  );

  // Рендеринг доски с пинами
  const renderBoard = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      ctx.fillStyle = "#ffffff";
      const startY = 50;
      const spacing = 30;

      for (let i = 0; i <= lines; i++) {
        for (let j = 0; j <= i; j++) {
          // Центрирование: сдвигаем ряд влево на половину его ширины (i/2 * spacing)
          // j - i/2 дает симметричное распределение относительно центра
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

  // Получение цвета слота на основе множителя
  const getSlotColor = (multiplier: number): string => {
    return getMultiplierColor(multiplier);
  };

  // Рендеринг слотов
  const renderSlots = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      if (multipliers.length === 0) return;

      const startY = 50;
      const spacing = 30;
      const slotY = startY + (lines + 1) * spacing + 10;
      const slotHeight = 45;

      // Ширина слота соответствует расстоянию между пинами
      const slotWidth = spacing - 4; // -4 для отступа

      multipliers.forEach((multiplier, index) => {
        // Позиция слота должна соответствовать позиции col на последнем ряду
        // index соответствует j в формуле пинов
        // Ряд (lines) имеет ширину (lines * spacing).
        // Центр слота index: width/2 + (index - lines/2) * spacing
        const centerX = width / 2 + (index - lines / 2) * spacing;
        const x = centerX - spacing / 2 + 2; // Левый край слота + отступ

        const color = getSlotColor(multiplier);

        ctx.fillStyle = color;
        ctx.fillRect(x, slotY, slotWidth, slotHeight);

        // Border/Shadow logic if needed
        ctx.fillStyle = "#000"; // Text color
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

  // Обновление и отрисовка шариков
  const updateAndDrawBalls = useCallback(
    (ctx: CanvasRenderingContext2D, width: number) => {
      const startY = 50;
      const spacing = 30;
      const slotY = startY + (lines + 1) * spacing + 10;
      const slotHeight = 45;

      // Обновляем шарики напрямую в ref
      const balls = activeBallsRef.current;

      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        // Удаляем старые завершенные шарики
        if (ball.finished && ball.finishTime) {
          if (Date.now() - ball.finishTime > 2000) {
            balls.splice(i, 1);
            continue;
          }
        }

        // Обновляем прогресс только для незавершенных шариков (логика из оригинального кода)
        if (!ball.finished) {
          // Уменьшаем шаг для более плавной анимации
          ball.progress += 0.08; // Более плавное падение

          if (ball.progress >= 1) {
            ball.progress = 0;
            ball.currentStep++;

            if (ball.currentStep >= ball.path.length) {
              // Шарик завершил путь - используем уже определенный slotIndex
              ball.finished = true;
              ball.highlightSlot = true;
              ball.finishTime = Date.now();

              // Вызываем callback когда шарик закончил
              setTimeout(() => {
                if (onBallFinish) {
                  onBallFinish(ball);
                }
              }, 2000);
            } else {
              // Переход к следующему шагу
              ball.row++;
              const direction = ball.path[ball.currentStep];
              ball.col += direction;
            }
          }
        }
      }

      // Отрисовка шариков
      balls.forEach((ball) => {
        const currentPathIndex = ball.currentStep;

        // Вычисляем начальную позицию колонки
        let startCol = 0;
        for (let k = 0; k < currentPathIndex; k++) {
          startCol += ball.path[k];
        }

        // Вычисляем конечную позицию колонки
        let endCol = startCol;
        if (currentPathIndex < ball.path.length) {
          endCol += ball.path[currentPathIndex];
        }

        // Интерполяция для плавного движения
        const t = ball.progress;
        const renderRow = currentPathIndex + t;
        const renderCol = startCol + (endCol - startCol) * t;

        // Вычисляем позицию на экране
        // Важно: renderCol - renderRow/2 сохраняет центровку
        const y = startY + renderRow * spacing;
        const x = width / 2 + (renderCol - renderRow / 2) * spacing;

        // Если шарик завершил путь, показываем его в слоте
        if (ball.currentStep >= ball.path.length) {
          // ball.slotIndex уже известен
          const index = ball.slotIndex;
          const centerX = width / 2 + (index - lines / 2) * spacing;
          const slotYCenter = slotY + slotHeight / 2;

          // Подсветка слота
          if (ball.highlightSlot) {
            const sx = centerX - spacing / 2 + 2;
            // Белая окантовка или подсветка
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(sx - 2, slotY - 2, spacing, slotHeight + 4);

            // Текст с выигрышем
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            const text = `+$${ball.payout.toFixed(2)}`;
            ctx.fillText(text, centerX, slotY - 20);
          }

          // Шарик в слоте
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(centerX, slotYCenter, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Шарик в движении
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(x, y - 5, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    [lines, onBallFinish],
  );

  // Основной цикл анимации
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
