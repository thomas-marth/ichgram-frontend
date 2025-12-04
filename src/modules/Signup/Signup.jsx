import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { signupUser } from "./../../redux/auth/authThunks";
import { resetSignupStatus } from "../../redux/auth/authSlice";
import { selectAuthRequest } from "../../redux/auth/authSelectors";

import Container from "../../shared/components/Container/Container";
import CardFooter from "../../shared/components/CardFooter/CardFooter";
import SignupForm from "./SignupForm/SignupForm";
import Logo from "./../../shared/components/Logo/Logo";

import styles from "./Signup.module.css";

const Signup = () => {
  const { error, loading, isSignupSuccess } = useSelector(selectAuthRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSignupStatus());
  }, [dispatch]);

  const onRegister = async (payload) => {
    dispatch(signupUser(payload));
  };

  if (isSignupSuccess) return <Navigate to="/login" />;

  return (
    <Container>
      <div className={styles.container}>
        <div>
          <div className={styles.card}>
            <Logo size="xl" />
            <p className={styles.title}>
              Sign up to see photos and videos from your friends.
            </p>

            <SignupForm
              requestErrors={error}
              isSubmitSuccess={isSignupSuccess}
              submitForm={onRegister}
            />
            {loading && <p>Register request...</p>}
          </div>

          <CardFooter prompt="Have an account?" linkText="Log in" to="/login" />
        </div>
      </div>
    </Container>
  );
};

export default Signup;
