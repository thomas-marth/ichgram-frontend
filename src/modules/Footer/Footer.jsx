import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const navItems = [
  { to: "/", label: "Home" },
  { label: "Search", isModal: true },
  { to: "/explore", label: "Explore" },
  { label: "Messages", isModal: true },
  { label: "Notifications", isModal: true },
  { label: "Create", isModal: true },
];

const Footer = ({ onOpenSideModal }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.menuWrap}>
        <ul className={styles.navList}>
          {navItems.map(({ to, label, isModal }) => {
            if (isModal) {
              return (
                <li key={label}>
                  <button
                    type="button"
                    className={`${styles.navLink} ${styles.navButton}`}
                    onClick={() => onOpenSideModal?.(label)}
                  >
                    {label}
                  </button>
                </li>
              );
            }

            return (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <p className={styles.copyright}>{`\u00A9 2024 ICHgram`}</p>
      </div>
    </footer>
  );
};

export default Footer;
