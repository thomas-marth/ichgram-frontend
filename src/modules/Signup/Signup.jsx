import { Link } from "react-router-dom";

import Container from "../../shared/components/Container/Container";
import FooterCard from "../../shared/components/FooterCard/FooterCard";
import SignupForm from "./SignupForm/SignupForm";

import logo from "../../assets/logo/logo.png";
import styles from "./Signup.module.css";

const Signup = () => {
  return (
    <Container>
      <div className={styles.container}>
        <div>
          <div className={styles.card}>
            <div className={styles.logo}>
              <img src={logo} alt="logo" />
            </div>

            <p className={styles.title}>
              Sign up to see photos and videos from your friends.
            </p>

            <SignupForm />

            <p className={styles.infoText}>
              People who use our service may have uploaded your contact
              information to Instagram. <Link to="/learn-more">Learn More</Link>
            </p>

            <p className={styles.policyText}>
              By signing up, you agree to our <Link to="/terms">Terms</Link>,{" "}
              <Link to="/privacy">Privacy Policy</Link> and{" "}
              <Link to="/cookies">Cookies Policy</Link>.
            </p>
          </div>

          <FooterCard prompt="Have an account?" linkText="Log in" to="/login" />
        </div>
      </div>
    </Container>
  );
};

export default Signup;
