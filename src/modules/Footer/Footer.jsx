import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.menuWrap}>
        <ul className={styles.navList}>
          <li className={styles.navLink}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.navLink}>
            <Link to="">Search</Link>
          </li>
          <li className={styles.navLink}>
            <Link to="/explore">Explore</Link>
          </li>
          <li className={styles.navLink}>
            <Link to="/messages">Messages</Link>
          </li>
          <li className={styles.navLink}>
            <Link to="">Notifications</Link>
          </li>
          <li className={styles.navLink}>
            <Link to="">Create</Link>
          </li>
        </ul>
        <p className={styles.copyright}>{`\u00A9 2024 ICHgram`}</p>
      </div>
    </footer>
  );
};

export default Footer;
