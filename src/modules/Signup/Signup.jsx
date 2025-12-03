import { useDispatch } from "react-redux";
import { signupUser } from "./../../redux/auth/authThunks";

import Container from "../../shared/components/Container/Container";
import CardFooter from "../../shared/components/CardFooter/CardFooter";
import SignupForm from "./SignupForm/SignupForm";

import styles from "./Signup.module.css";
import Logo from "./../../shared/components/Logo/Logo";

const Signup = () => {
  const dispatch = useDispatch();
  const onSubmit = async (payload) => {
    dispatch(signupUser(payload));
  };

  return (
    <Container>
      <div className={styles.container}>
        <div>
          <div className={styles.card}>
            <Logo size="xl" />
            <p className={styles.title}>
              Sign up to see photos and videos from your friends.
            </p>

            <SignupForm submitForm={onSubmit} />
          </div>

          <CardFooter prompt="Have an account?" linkText="Log in" to="/login" />
        </div>
      </div>
    </Container>
  );
};

export default Signup;
