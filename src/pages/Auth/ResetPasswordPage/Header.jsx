import logo from "../../../assets/logo/logo.png";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <img className={styles.logo} src={logo} alt="ICHgram logo" />
      </div>
    </header>
  );
};

export default Header;
