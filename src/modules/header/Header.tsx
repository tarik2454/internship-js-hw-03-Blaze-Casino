import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { logoutUser } from "../../config/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { Logo } from "../../shared/icons/logo";
import Container from "../../shared/components/Container";
import { Wallet } from "../../shared/icons/wallet";
import { Settings } from "../../shared/icons/settings";
import { Auth } from "../../shared/icons/auth";
import Modal from "../../shared/components/Modal";
import { Profile } from "../profile/Profile";
import { useUserStats } from "../../context/useUserStats";
import { handleApiError } from "../../utils/errorHandler";
import { storage } from "../../utils/storage";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export const Header = () => {
  const navigate = useNavigate();
  const { balance } = useUserStats();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prevValue) => !prevValue);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      toast.success("Successfully logged out!");
      storage.remove(STORAGE_KEYS.LEADERBOARD_USERS);
      navigate("/auth/login");
    } catch (error) {
      handleApiError(error, "Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerInner}>
            <Link className={styles.logo} to="/">
              <Logo />
              Rocket Casino
            </Link>

            <div className={styles.headerActions}>
              <div className={styles.balance}>
                <Wallet />

                <span className={styles.amount}>${balance.toFixed(2)}</span>
              </div>

              <button className={styles.profileBtn} onClick={toggleModal}>
                <Settings />
              </button>

              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={isLoading}
              >
                <Auth />
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        {isModalOpen && <Profile />}
      </Modal>
    </>
  );
};
