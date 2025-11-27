import { NavLink } from "react-router-dom";

// import logo from "../../assets/logo/logo.png";
import HomeIcon from "../../assets/icons/HomeIcon";
import HomeIconActive from "../../assets/icons/HomeIconActive";
import SearchIcon from "../../assets/icons/SearchIcon";
import ExploreIcon from "../../assets/icons/ExploreIcon";
import ExploreIconActive from "../../assets/icons/ExploreIconActive";
import MessagesIcon from "../../assets/icons/MessagesIcon";
import NotificationsIcon from "../../assets/icons/NotificationsIcon";
import CreateIcon from "../../assets/icons/CreateIcon";
import UserIcon from "../../assets/icons/UserIcon";
import styles from "./Sidebar.module.css";
import Logo from "./../../shared/components/Logo/Logo";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon, activeIcon: HomeIconActive },
  { label: "Search", icon: SearchIcon, isModal: true },
  {
    to: "/explore",
    label: "Explore",
    icon: ExploreIcon,
    activeIcon: ExploreIconActive,
  },
  { label: "Messages", icon: MessagesIcon, isModal: true },
  { label: "Notifications", icon: NotificationsIcon, isModal: true },
  { label: "Create", icon: CreateIcon, isModal: true },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Logo size="xs" className={styles.navLogo} />
      <nav className={styles.nav}>
        {navItems.map(
          ({ to, label, icon: Icon, activeIcon: ActiveIcon, isModal }) => {
            const profileLinkClass =
              label === "Profile" ? styles.profileLink : "";
            if (isModal) {
              return (
                <button
                  key={label}
                  type="button"
                  className={`${styles.link} ${profileLinkClass}`.trim()}
                >
                  <Icon className={styles.icon} />
                  <span>{label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `${styles.link} ${profileLinkClass} ${
                    isActive ? styles.active : ""
                  }`.trim()
                }
              >
                {({ isActive }) => {
                  const IconComponent =
                    isActive && ActiveIcon ? ActiveIcon : Icon;

                  return (
                    <>
                      <IconComponent className={styles.icon} />
                      <span>{label}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          }
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
