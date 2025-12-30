import { useEffect, useState } from "react";
import { cx } from "../../utils/classNames";
import styles from "./GameResultPopup.module.scss";

interface GameResultPopupProps {
  profit: number;
  onClose?: () => void;
  autoCloseDelay?: number; // default: 5000ms
}

export const GameResultPopup = ({
  profit,
  onClose,
  autoCloseDelay = 5000,
}: GameResultPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onClose?.();
      }, 300);
    }, autoCloseDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [autoCloseDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose?.();
    }, 300);
  };

  if (!shouldRender) return null;

  const isWin = profit >= 0;

  return (
    <div
      className={cx(
        styles.popup,
        isVisible && styles.visible,
        isWin && styles.win,
      )}
    >
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
      <div className={styles.content}>
        <span className={styles.label}>
          {isWin ? "You won!" : "You lost"}
        </span>
        <span className={styles.amount}>
          {isWin ? "+" : "-"}${Math.abs(profit).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

