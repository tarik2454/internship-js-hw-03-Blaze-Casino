import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import styles from "./Auth.module.scss";
import {
  registerSchema,
  type RegisterFormData,
} from "../../utils/zodValidation";
import { Auth } from "../../shared/icons/auth";
import { registerUser } from "../../config/authApi";
import { toast } from "react-toastify";

import { Input } from "../../shared/components/Input";

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success("Registration successful!");

      navigate("/auth/login");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        id="username"
        label="Username"
        type="text"
        placeholder="Username"
        error={errors.username}
        {...register("username")}
      />

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
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>

      <p className={styles.linkWrapper}>
        <Link to="/auth/login" className={styles.link}>
          Already have an account? Sign In
        </Link>
      </p>
    </form>
  );
};
