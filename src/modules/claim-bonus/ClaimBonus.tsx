import { Bonus } from "../../shared/icons/bonus";
import styles from "./ClaimBonus.module.scss";
import { Timer } from "../../shared/icons/timer";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserStats } from "../../context/useUserStats";
import { logger } from "../../utils/logger";

export const ClaimBonus = () => {
  const { updateStats } = useUserStats();
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(
    null,
  );

  const claimBonus = async () => {
    const now = Date.now();
    const COOLDOWN = 60 * 1000;
    if (lastBonusClaimTime && now - lastBonusClaimTime < COOLDOWN) {
      const remaining = Math.ceil(
        (COOLDOWN - (now - lastBonusClaimTime)) / 1000,
      );
      return toast.warning(
        `Please wait ${remaining} seconds before claiming again!`,
      );
    }

    try {
      await updateStats(10);
      setLastBonusClaimTime(now);
      toast.success("Bonus claimed!");
    } catch (error) {
      logger.error("Failed to claim bonus:", error);
      toast.error("Failed to claim bonus");
    }
  };
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastBonusClaimTime) {
        setTimeRemaining(0);
        return;
      }

      const now = Date.now();
      const COOLDOWN_MS = 60 * 1000;
      const elapsed = now - lastBonusClaimTime;
      const remaining = Math.max(0, COOLDOWN_MS - elapsed);

      setTimeRemaining(Math.ceil(remaining / 1000));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastBonusClaimTime]);

  const canClaim = timeRemaining === 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClaim = () => {
    if (canClaim) {
      claimBonus();
    }
  };

  return (
    <section className={styles.claimSection}>
      <div className={styles.claimHeader}>
        <div className={styles.iconWrapper}>
          <Bonus />
        </div>

        <div>
          <h2 className={styles.title}>Claim Bonus</h2>
          <p className={styles.description}>Free money every minute</p>
        </div>
      </div>

      <div className={styles.claimContent}>
        <div className={styles.claimTimer}>
          Next Claim:
          <span>
            <Timer /> {canClaim ? "Ready!" : formatTime(timeRemaining)}
          </span>
        </div>
        <div className={styles.claimAmount}>
          Amount: <span>$10</span>
        </div>
      </div>

      <button
        className={styles.claimBtn}
        onClick={handleClaim}
        disabled={!canClaim}
      >
        {canClaim ? "Claim Now!" : "Wait..."}
      </button>
    </section>
  );
};
