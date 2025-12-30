import { ClaimBonus } from "../modules/claim-bonus/ClaimBonus";
import styles from "./HomePage.module.scss";
import Container from "../shared/components/Container";
import PageWrapper from "../shared/components/PageWrapper";
import { Leaderboard } from "../modules/leaderboard/Leaderboard";
import { useState } from "react";
import { homeTabs } from "../constants/homeTabs";
import { cx } from "../utils/classNames";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState(homeTabs[0].id);

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
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </section>

            <div className={styles.gameContent}>
              {homeTabs.find((tab) => tab.id === activeTab)?.content}
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
