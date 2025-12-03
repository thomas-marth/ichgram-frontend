import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import signupStyles from "../Signup.module.css";
import styles from "./SignupForm.module.css";

const SignupForm = ({ submitForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    submitForm(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputWrap}>
        <TextField
          register={register}
          rules={{ required: "email is required" }}
          name="email"
          type="email"
          placeholder="Email"
          error={errors.email}
        />

        <TextField
          register={register}
          rules={{ required: "fullname is required" }}
          name="fullName"
          placeholder="Full Name"
          error={errors.fullName}
        />

        <TextField
          register={register}
          rules={{ required: "username is required" }}
          name="username"
          placeholder="Username"
          error={errors.username}
        />

        <TextField
          register={register}
          rules={{ required: "password required" }}
          name="password"
          type="password"
          placeholder="Password"
          error={errors.password}
        />
      </div>

      <p className={signupStyles.infoText}>
        People who use our service may have uploaded your contact information to
        Instagram.
        <Link to="/learn-more" className={styles.learnMore}>
          Learn More
        </Link>
      </p>

      <p className={signupStyles.policyText}>
        By signing up, you agree to our <Link to="/terms">Terms</Link>,
        <Link to="/privacy"> Privacy Policy</Link> and{" "}
        <Link to="/cookies">Cookies Policy</Link>.
      </p>

      <Button type="submit" className={styles.submitBtn}>
        Sign up
      </Button>
    </form>
  );
};

export default SignupForm;
