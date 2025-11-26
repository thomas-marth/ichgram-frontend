import styles from "./Logo.module.css";
import logo from "../../../assets/logo/logo.png";

const Logo = ({ size = "xs", className = "" }) => {
  return (
    <div className={styles.logo}>
      <img
        src={logo}
        className={`${styles.logoImg} ${styles[size]} ${className}`}
        alt="ICHGRAM logo"
      />
    </div>
  );
};

export default Logo;
