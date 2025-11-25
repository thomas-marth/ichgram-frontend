import Container from "../../shared/components/Container/Container";
import LoginForm from "./LoginForm/LoginForm";

import { Link } from "react-router-dom";

import logo from "../../assets/logo/logo.png";
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
              <div className={styles.img}>
                <img src={logo} alt="logo" />
              </div>
            </div>

            <LoginForm />

            <div className={styles.divider}>OR</div>

            <div className={styles.text}>
              <Link to="/reset">Forgot password?</Link>
            </div>
          </div>

          <div className={styles.wrappInfo}>
            <p className={styles.wrappText}>
              Don't have an account?
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
