import { ClaimBonus } from "../modules/claim-bonus/ClaimBonus";
import styles from "./HomePage.module.scss";
import Container from "../shared/components/Container";
import PageWrapper from "../shared/components/PageWrapper";
import { Leaderboard } from "../modules/leaderboard/Leaderboard";
import { useState, Suspense } from "react";
import { homeTabs } from "../constants/homeTabs";
import { cx } from "../utils/classNames";
import { useUserStats } from "../context/useUserStats";
import { toast } from "react-toastify";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState(homeTabs[0].id);
  const { isAnyGameActive } = useUserStats();

  const handleTabChange = (tabId: typeof homeTabs[number]["id"]) => {
    if (isAnyGameActive && tabId !== activeTab) {
      toast.warning("Please finish the current game before switching tabs");
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <PageWrapper>
      <Container>
        <div className={styles.homePage}>
          <div>
            <section className={styles.tabsWrapper}>
              {homeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={cx(
                    styles.gameButton,
                    activeTab === tab.id && styles.isActive,
                  )}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={isAnyGameActive && tab.id !== activeTab}
                >
                  {tab.label}
                </button>
              ))}
            </section>

            <div className={styles.gameContent}>
              <Suspense fallback={<div>Loading game...</div>}>
                {(() => {
                  const tab = homeTabs.find((tab) => tab.id === activeTab);
                  const Component = tab?.Component;
                  return Component ? <Component /> : null;
                })()}
              </Suspense>
            </div>
          </div>

          <div className={styles.sideColumn}>
            <ClaimBonus />
            <Leaderboard />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
