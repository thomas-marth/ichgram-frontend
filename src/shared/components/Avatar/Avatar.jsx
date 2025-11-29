import styles from "./Avatar.module.css";

const sizeClasses = {
  xs: styles.extraSmall,
  sm: styles.small,
  md: styles.medium,
  lg: styles.large,
  xl: styles.extraLarge,
};

const Avatar = ({ size = "sm", src, alt = "", withGradient = false }) => {
  const sizeClass = sizeClasses[size] ?? styles.medium;
  const wrapperClassName = [styles.avatarWrapper, sizeClass];

  if (withGradient) {
    wrapperClassName.push(styles.withGradient);
  }

  return (
    <div className={wrapperClassName.join(" ")}>
      <div className={withGradient ? styles.gapRing : styles.innerWrapper}>
        {src ? (
          <img className={styles.avatar} src={src} alt={alt} />
        ) : (
          <div className={styles.avatar} />
        )}
      </div>
    </div>
  );
};

export default Avatar;
