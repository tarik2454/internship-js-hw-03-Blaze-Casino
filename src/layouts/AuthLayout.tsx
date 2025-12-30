import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.scss";
import { LogoAuth } from "../shared/icons/logoAuth";

export const AuthLayout = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <LogoAuth />
          </div>
          <h1 className={styles.title}>Rocket Casino</h1>

          <p className={styles.subtitle}>Welcome back!</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
