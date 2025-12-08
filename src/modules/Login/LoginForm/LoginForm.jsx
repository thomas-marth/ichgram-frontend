import { useEffect } from "react";
import { useForm } from "react-hook-form";

import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import styles from "./LoginForm.module.css";

const LoginForm = ({ requestErrors, submitForm }) => {
  const {
    register,
    handleSubmit,
    setError,
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

  const onSubmit = async (values) => {
    submitForm(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputWrap}>
        <TextField
          register={register}
          name="email"
          rules={{ required: "Email or username is required" }}
          placeholder="Username, or email"
          error={errors.email}
        />

        <TextField
          register={register}
          name="password"
          rules={{ required: "Password required" }}
          type="password"
          placeholder="Password"
          error={errors.password}
        />
      </div>

      <div>
        <Button type="submit">Log in</Button>
      </div>
    </form>
  );
};

export default LoginForm;
