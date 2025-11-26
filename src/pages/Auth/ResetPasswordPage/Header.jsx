// import logo from "../../../assets/logo/logo.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import Logo from "./../../../shared/components/Logo/Logo";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link to="/login">
          <Logo size="xs" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
