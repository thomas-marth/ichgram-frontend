import Container from "./../../shared/components/Container/Container";
import styles from "./NotFound.module.css";
import loginImg from "../../assets/images/loginImg.png";

const NotFound = () => {
  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.imgWrap}>
          <img
            src={loginImg}
            alt="Preview of the Ichgram mobile app interface on a smartphone screen"
          />
        </div>
        <div className={styles.textWrap}>
          <h1 className={styles.pageTitle}>Oops! Page Not Found (404 Error)</h1>
          <p className={styles.pageDescription}>
            We're sorry, but the page you're looking for doesn't seem to exist.
            If you typed the URL manually, please double-check the spelling. If
            you clicked on a link, it may be outdated or broken.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
