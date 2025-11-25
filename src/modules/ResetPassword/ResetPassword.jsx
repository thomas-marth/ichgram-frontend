import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Container from "../../shared/components/Container/Container";
import TextField from "../../shared/components/TextField/TextField";
import Button from "../../shared/components/Button/Button";

import troubleLoginImg from "../../assets/images/trouble-login.png";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    console.log(values);
    reset();
  };

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.illustration}>
            <img src={troubleLoginImg} alt="Trouble logging in illustration" />
          </div>

          <h1 className={styles.title}>Trouble logging in?</h1>
          <p className={styles.subtitle}>
            Enter your email, phone, or username and we&apos;ll send you a link
            to get back into your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              register={register}
              name="identifier"
              placeholder="Email or Username"
              rules={{
                required: "This field is required",
              }}
              error={errors.identifier}
            />

            <Button type="submit">Reset your password</Button>
          </form>

          <div className={styles.divider}>OR</div>

          <div className={styles.createAccount}>
            <Link to="/signup">Create new account</Link>
          </div>
        </div>

        <div className={styles.backLink}>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;
