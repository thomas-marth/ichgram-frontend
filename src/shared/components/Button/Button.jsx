import styles from "./Button.module.css";

const Button = ({ type = "button", className = "", children, ...props }) => {
  return (
    <button className={`${styles.btn} ${className}`} type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
