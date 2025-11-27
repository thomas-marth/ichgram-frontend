import { Link } from "react-router-dom";

import Container from "../../shared/components/Container/Container";
import CardFooter from "../../shared/components/CardFooter/CardFooter";
import SignupForm from "./SignupForm/SignupForm";

import styles from "./Signup.module.css";
import Logo from "./../../shared/components/Logo/Logo";

const Signup = () => {
  return (
    <Container>
      <div className={styles.container}>
        <div>
          <div className={styles.card}>
            <Logo size="xl" />
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

          <CardFooter prompt="Have an account?" linkText="Log in" to="/login" />
        </div>
      </div>
    </Container>
  );
};

export default Signup;
