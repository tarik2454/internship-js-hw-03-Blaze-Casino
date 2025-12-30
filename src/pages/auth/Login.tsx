import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import styles from "./Auth.module.scss";
import { loginSchema, type LoginFormData } from "../../utils/zodValidation";
import { Auth } from "../../shared/icons/auth";
import { loginUser } from "../../config/authApi";
import { toast } from "react-toastify";
import { logger } from "../../utils/logger";

import { Input } from "../../shared/components/Input";

export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test-user@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUser(data);
      toast.success("Login successful!");

      navigate("/");
    } catch (err: unknown) {
      logger.error(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Invalid credentials");
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        id="email"
        label="Email"
        type="text"
        placeholder="Email"
        error={errors.email}
        {...register("email")}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Password"
        error={errors.password}
        {...register("password")}
      />

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        <Auth />
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <p className={styles.linkWrapper}>
        <Link to="/auth/register" className={styles.link}>
          Don't have an account? Register
        </Link>
      </p>
    </form>
  );
};
