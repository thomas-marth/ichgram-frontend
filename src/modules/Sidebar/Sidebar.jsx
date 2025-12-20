import { Link, NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

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
import { selectUser } from "../../redux/auth/authSelectors";

const Sidebar = ({
  onOpenSideModal,
  onCloseSideModal,
  onSetActiveNavItem,
  activeNavItem,
  unseenNotificationsCount = 0,
}) => {
  const currentUser = useSelector(selectUser);
  const userId = currentUser?.id || currentUser?._id;
  const userAvatar = currentUser?.avatar || currentUser?.profile_image;
  const profileAlt =
    currentUser?.username || currentUser?.name || "User profile";

  const navItems = useMemo(() => {
    const profilePath = userId ? `/profile/${userId}` : "/profile";
    const ProfileIcon = (props) => (
      <UserIcon {...props} src={userAvatar} alt={`${profileAlt} avatar`} />
    );

    return [
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
        badge: unseenNotificationsCount,
      },
      { label: "Create", icon: CreateIcon, isModal: true },
      {
        to: profilePath,
        label: "Profile",
        icon: ProfileIcon,
        activeIcon: ProfileIcon,
      },
    ];
  }, [profileAlt, unseenNotificationsCount, userAvatar, userId]);

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.navLogo} onClick={onCloseSideModal}>
        <Logo size="xs" />
      </Link>
      <nav className={styles.nav}>
        {navItems.map(
          ({
            to,
            label,
            icon: Icon,
            activeIcon: ActiveIcon,
            isModal,
            badge,
          }) => {
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
                  <span className={styles.labelWrapper}>
                    <span>{label}</span>
                    {badge ? (
                      <span className={styles.badge}>{badge}</span>
                    ) : null}
                  </span>
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
