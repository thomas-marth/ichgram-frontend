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
  (
    { onOpenSideModal, onCloseSideModal, onSetActiveNavItem, activeNavItem },
    ref
  ) => {
    return (
      <footer ref={ref} className={styles.footer}>
        <div className={styles.menuWrap}>
          <ul className={styles.navList}>
            {navItems.map(({ to, label, isModal }) => {
              const isActive = label === activeNavItem;

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
                    className={() =>
                      `${styles.navLink} ${isActive ? styles.active : ""}`
                    }
                    onClick={() => {
                      onCloseSideModal?.();
                      onSetActiveNavItem?.(null);
                    }}
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
