import styles from "./UserIcon.module.css";

const UserIcon = ({ className = "", src, alt = "User avatar" }) => {
  const wrapperClassName = [styles.userIcon, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {src ? <img className={styles.avatarImage} src={src} alt={alt} /> : null}
    </div>
  );
};

export default UserIcon;
