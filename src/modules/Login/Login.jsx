import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "./../../redux/auth/authThunks";
import { resetSignupStatus } from "../../redux/auth/authSlice";
import {
  selectAuthRequest,
  selectIsAuthenticated,
} from "../../redux/auth/authSelectors";

import Container from "../../shared/components/Container/Container";
import CardFooter from "../../shared/components/CardFooter/CardFooter";
import LoginForm from "./LoginForm/LoginForm";

import Logo from "./../../shared/components/Logo/Logo";
import loginImg from "../../assets/images/loginImg.png";
import styles from "./Login.module.css";

const Login = () => {
  const { error, loading } = useSelector(selectAuthRequest);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetSignupStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onLogin = async (payload) => {
    dispatch(loginUser(payload));
  };

  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.imgWrap}>
          <img
            src={loginImg}
            alt="Preview of the Ichgram mobile app interface on a smartphone screen"
          />
        </div>

        <div>
          <div className={styles.wrappForm}>
            <div className={styles.logo}>
              <Logo size="xl" />
            </div>

            <LoginForm requestErrors={error} submitForm={onLogin} />
            {loading && <p>Login request...</p>}

            <div className={styles.divider}>OR</div>

            <div className={styles.text}>
              <Link to="/reset">Forgot password?</Link>
            </div>
          </div>

          <CardFooter
            prompt="Don't have an account?"
            linkText="Sign up"
            to="/signup"
          />
        </div>
      </div>
    </Container>
  );
};

export default Login;
