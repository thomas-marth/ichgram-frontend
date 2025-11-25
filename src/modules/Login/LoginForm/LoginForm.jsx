import { useForm } from "react-hook-form";

import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
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
          placeholder="Username, or email"
          error={errors.email}
        />

        <TextField
          register={register}
          name="password"
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
