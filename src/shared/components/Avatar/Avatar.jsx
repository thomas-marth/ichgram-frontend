import styles from "./Avatar.module.css";

const sizeClasses = {
  xs: styles.extraSmall,
  sm: styles.small,
  md: styles.medium,
  lg: styles.large,
  xl: styles.extraLarge,
};

const Avatar = ({ size = "sm" }) => {
  const sizeClass = sizeClasses[size] ?? styles.medium;

  return (
    <div className={`${styles.avatarWrapper} ${sizeClass}`.trim()}>
      <div className={styles.avatar} />
    </div>
  );
};

export default Avatar;
