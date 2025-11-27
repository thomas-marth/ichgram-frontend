import styles from "./NotFoundPage.module.css";
import loginImg from "../../assets/images/loginImg.png";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.imgWrap}>
        <img
          src={loginImg}
          alt="Preview of the Ichgram mobile app interface on a smartphone screen"
        />
      </div>
      <h1>Oops! Page Not Found (404 Error)</h1>
      <p>
        We're sorry, but the page you're looking for doesn't seem to exist. If
        you typed the URL manually, please double-check the spelling. If you
        clicked on a link, it may be outdated or broken.
      </p>
    </div>
  );
}
