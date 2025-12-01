import styles from "./Button.module.css";

const Button = ({
  type = "button",
  className = "",
  variant = "primary",
  children,
  ...props
}) => {
  const variantClass = variant === "gray" ? styles.gray : "";

  return (
    <button
      className={`${styles.btn} ${variantClass} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
