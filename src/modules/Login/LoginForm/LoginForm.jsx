import Button from "../../../shared/components/Button/Button";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  return (
    <form className={styles.formStyle}>
      <div className={styles.inputBlock}>
        <input className={styles.inputStyle} type="email" placeholder="Email" />

        <input
          className={styles.inputStyle}
          type="password"
          placeholder="Password"
        />
      </div>

      <div>
        <Button type="submit">Log in</Button>
      </div>
    </form>
  );
};

export default LoginForm;
