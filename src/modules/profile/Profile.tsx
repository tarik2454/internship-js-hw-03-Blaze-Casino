import { useForm } from "react-hook-form";
import { useEffect } from "react";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../../shared/icons/user";
import { toast } from "react-toastify";
import { updateUser } from "../../api/user";
import { handleApiError } from "../../api/auth";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "../../utils/zodValidation";
import { useUserStats } from "../../context/useUserStats";
import { cx } from "../../utils/classNames";
import { storage } from "../../utils/storage";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export const Profile = () => {
  const {
    balance,
    totalWagered,
    gamesPlayed,
    totalWon,
    username,
    isLoading: isLoadingUser,
    refreshStats,
  } = useUserStats();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: username || "",
    },
  });

  useEffect(() => {
    if (username) {
      setValue("username", username);
    }
  }, [username, setValue]);

  const resetAccount = async () => {
    try {
      await updateUser({
        username,
        balance: 0,
        totalWagered: 0,
        gamesPlayed: 0,
        totalWon: 0,
      });
      await refreshStats();
      storage.remove(STORAGE_KEYS.USER_DATA);
      toast.success("Account reset successfully!");
    } catch (error) {
      handleApiError(error, "Failed to reset account");
    }
  };

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUser({
        username: data.username,
        balance,
        totalWagered,
        gamesPlayed,
        totalWon,
      });
      await refreshStats();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      handleApiError(err, "Profile update failed");
    }
  };

  const usernameValue = watch("username");
  const maxChars = 20;
  const remainingChars = maxChars - (usernameValue?.length || 0);

  return (
    <div className={styles.profileContainer}>
      <p className={styles.profileTitle}>Profile Settings</p>
      <p className={styles.profileSubtitle}>
        Customize your profile and manage your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.labelWrapper}>
            <User /> <label htmlFor="username">Username</label>
          </div>

          <div className={styles.inputWrapper}>
            <input
              id="username"
              type="text"
              maxLength={20}
              placeholder={isLoadingUser ? "Loading..." : "Username"}
              disabled={isLoadingUser}
              {...register("username")}
              className={cx(errors.username && "errorInput")}
            />
          </div>
          {errors.username && (
            <span className="errorMessage">{errors.username.message}</span>
          )}
        </div>
      </form>

      <div className={styles.characters}>
        {remainingChars}/20 <span>characters</span>
      </div>

      <div className={styles.amountStats}>
        <p className={styles.titleStats}>Account Stats</p>
        <div className={styles.statsWrapper}>
          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Balance <span>${balance.toFixed(2)}</span>
            </div>
            <div className={styles.balance}>
              Total Wagered <span>${totalWagered.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Games Played <span>{gamesPlayed}</span>
            </div>
            <div className={styles.balance}>
              Total Won <span>${totalWon.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button
          className={styles.saveBtn}
          disabled={isSubmitting || isLoadingUser}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
        <button
          className={styles.resetBtn}
          disabled={isSubmitting || isLoadingUser}
          onClick={() => resetAccount()}
        >
          {isSubmitting ? "Reseting Account..." : "Reset Account"}
        </button>
      </div>
    </div>
  );
};
