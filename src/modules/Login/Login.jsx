import Container from "../../shared/components/Container/Container";
import CardFooter from "../../shared/components/CardFooter/CardFooter";
import LoginForm from "./LoginForm/LoginForm";

import { Link } from "react-router-dom";

import Logo from "./../../shared/components/Logo/Logo";
import loginImg from "../../assets/images/loginImg.png";
import styles from "./Login.module.css";

const Login = () => {
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

            <LoginForm />

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
