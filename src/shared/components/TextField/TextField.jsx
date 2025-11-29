import { useId } from "react";
import ClearButtonIcon from "../../../assets/icons/clear-btn.svg";
import styles from "./TextField.module.css";

export default function TextField({
  label,
  register,
  name,
  rules,
  type = "text",
  error,
  showClearButton = false,
  onClear,
  ...props
}) {
  const id = useId();

  const { className, ...restProps } = props;
  const registration = register ? register(name, rules) : {};
  const autoCompleteValue = type === "password" ? "new-password" : "on";

  return (
    <>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          autoComplete={autoCompleteValue}
          {...restProps}
          {...registration}
          className={`${styles.input} ${className || ""}`.trim()}
        />
        {showClearButton && onClear ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear input"
          >
            <img src={ClearButtonIcon} alt="Clear" />
          </button>
        ) : null}
      </div>
      {error && <p className={styles.error}>{error?.message}</p>}
    </>
  );
}
