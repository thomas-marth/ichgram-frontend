import { useId } from "react";
import styles from "./TextField.module.css";

export default function TextField({
  label,
  register,
  name,
  rules,
  type = "text",
  error,
  ...props
}) {
  const id = useId();

  const autoCompleteValue = type === "password" ? "new-password" : "on";

  return (
    <>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        autoComplete={autoCompleteValue}
        {...register(name, rules)}
        {...props}
        className={styles.input}
      />
      {error && <p className={styles.error}>{error?.message}</p>}
    </>
  );
}
