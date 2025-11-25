import { useForm } from "react-hook-form";

import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import styles from "./SignupForm.module.css";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    console.log(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputWrap}>
        <TextField
          register={register}
          name="email"
          type="email"
          placeholder="Email"
          error={errors.email}
        />

        <TextField
          register={register}
          name="fullName"
          placeholder="Full Name"
          error={errors.fullName}
        />

        <TextField
          register={register}
          name="username"
          placeholder="Username"
          error={errors.username}
        />

        <TextField
          register={register}
          name="password"
          type="password"
          placeholder="Password"
          error={errors.password}
        />
      </div>

      <Button type="submit" className={styles.submitBtn}>
        Sign up
      </Button>
    </form>
  );
};

export default SignupForm;
