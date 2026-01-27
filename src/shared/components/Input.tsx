import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import styles from "./Input.module.scss";
import { cx } from "../../utils/classNames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  classNameLabel?: string;
  classNameInput?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, id, className, classNameLabel, classNameInput, ...props },
    ref,
  ) => {
    return (
      <div className={cx(styles.inputGroup, className)}>
        <label htmlFor={id} className={cx(styles.label, classNameLabel)}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            ref={ref}
            className={cx(error && "errorInput", styles.input, classNameInput)}
            {...props}
          />
        </div>
        {error && <span className="errorMessage">{error.message}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
