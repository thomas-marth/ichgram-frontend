import { Link, NavLink } from "react-router-dom";

import HomeIcon from "../../assets/icons/HomeIcon";
import HomeIconActive from "../../assets/icons/HomeIconActive";
import SearchIcon from "../../assets/icons/SearchIcon";
import ExploreIcon from "../../assets/icons/ExploreIcon";
import ExploreIconActive from "../../assets/icons/ExploreIconActive";
import MessagesIcon from "../../assets/icons/MessagesIcon";
import MessagesIconActive from "../../assets/icons/MessagesIconActive";
import NotificationsIcon from "../../assets/icons/NotificationsIcon";
import NotificationsIconActive from "../../assets/icons/NotificationsIconActive";
import CreateIcon from "../../assets/icons/CreateIcon";
import UserIcon from "../../assets/icons/UserIcon";
import styles from "./Sidebar.module.css";
import Logo from "./../../shared/components/Logo/Logo";
import SearchIconActive from "../../assets/icons/SearchIconActive";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon, activeIcon: HomeIconActive },
  {
    label: "Search",
    icon: SearchIcon,
    activeIcon: SearchIconActive,
    isModal: true,
  },
  {
    to: "/explore",
    label: "Explore",
    icon: ExploreIcon,
    activeIcon: ExploreIconActive,
  },
  {
    to: "/direct",
    label: "Messages",
    icon: MessagesIcon,
    activeIcon: MessagesIconActive,
  },
  {
    label: "Notifications",
    icon: NotificationsIcon,
    activeIcon: NotificationsIconActive,
    isModal: true,
  },
  { label: "Create", icon: CreateIcon, isModal: true },
  { to: "/profile/1", label: "Profile", icon: UserIcon },
];

const Sidebar = ({
  onOpenSideModal,
  onCloseSideModal,
  onSetActiveNavItem,
  activeNavItem,
}) => {
  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.navLogo} onClick={onCloseSideModal}>
        <Logo size="xs" />
      </Link>
      <nav className={styles.nav}>
        {navItems.map(
          ({ to, label, icon: Icon, activeIcon: ActiveIcon, isModal }) => {
            const profileLinkClass =
              label === "Profile" ? styles.profileLink : "";
            if (isModal) {
              const isActive = label === activeNavItem;
              const IconComponent = isActive && ActiveIcon ? ActiveIcon : Icon;

              return (
                <button
                  key={label}
                  type="button"
                  className={`${styles.link} ${profileLinkClass} ${
                    isActive ? styles.active : ""
                  }`.trim()}
                  onClick={() => onOpenSideModal?.(label)}
                >
                  <IconComponent className={styles.icon} />
                  <span>{label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={label}
                to={to}
                className={() =>
                  `${styles.link} ${profileLinkClass} ${
                    activeNavItem === label ? styles.active : ""
                  }`.trim()
                }
                onClick={() => {
                  onCloseSideModal?.();
                  onSetActiveNavItem?.(null);
                }}
              >
                {() => {
                  const IconComponent =
                    activeNavItem === label && ActiveIcon ? ActiveIcon : Icon;

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
