import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import signupStyles from "../Signup.module.css";
import styles from "./SignupForm.module.css";

const SignupForm = ({ requestErrors, isSubmitSuccess, submitForm }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (requestErrors) {
      for (const key in requestErrors) {
        setError(key, {
          message: requestErrors[key],
        });
      }
    }
  }, [requestErrors, setError]);

  useEffect(() => {
    if (isSubmitSuccess) {
      reset();
    }
  }, [isSubmitSuccess, reset]);

  const onSubmit = async (values) => {
    submitForm(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputWrap}>
        <TextField
          register={register}
          rules={{ required: "Email is required" }}
          name="email"
          type="email"
          placeholder="Email"
          error={errors.email}
        />

        <TextField
          register={register}
          rules={{ required: "Fullname is required" }}
          name="fullName"
          placeholder="Full Name"
          error={errors.fullName}
        />

        <TextField
          register={register}
          rules={{ required: "Username is required" }}
          name="username"
          placeholder="Username"
          error={errors.username}
        />

        <TextField
          register={register}
          rules={{ required: "Password required" }}
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
