import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.scss";
import { loginSchema, type LoginFormData } from "../../utils/zodValidation";
import { Auth } from "../../shared/icons/auth";
import { loginUser, handleApiError } from "../../api/auth";
import { toast } from "react-toastify";

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
      handleApiError(err, "Invalid credentials");
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
