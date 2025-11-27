import { forwardRef } from "react";
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

const Footer = forwardRef(
  ({ onOpenSideModal, onCloseSideModal, activeSideModal }, ref) => {
    return (
      <footer ref={ref} className={styles.footer}>
        <div className={styles.menuWrap}>
          <ul className={styles.navList}>
            {navItems.map(({ to, label, isModal }) => {
              const isActive = label === activeSideModal;

              if (isModal) {
                return (
                  <li key={label}>
                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.navButton} ${
                        isActive ? styles.active : ""
                      }`.trim()}
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
                    onClick={onCloseSideModal}
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
  }
);

Footer.displayName = "Footer";

export default Footer;
