import styles from "./Avatar.module.css";

const sizeClasses = {
  xs: styles.extraSmall,
  sm: styles.small,
  md: styles.medium,
  lg: styles.large,
  xl: styles.extraLarge,
};

const gradientClasses = {
  xs: styles.gradientXs,
  xl: styles.gradientXl,
};

const Avatar = ({ size = "sm", src, alt = "", withGradient = false }) => {
  const sizeClass = sizeClasses[size] ?? styles.medium;
  const gradientClass = gradientClasses[size];
  const shouldApplyGradient = withGradient && Boolean(gradientClass);
  const wrapperClassName = [styles.avatarWrapper, sizeClass];

  if (shouldApplyGradient) {
    wrapperClassName.push(styles.withGradient, gradientClass);
  }

  return (
    <div className={wrapperClassName.join(" ")}>
      <div
        className={shouldApplyGradient ? styles.gapRing : styles.innerWrapper}
      >
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
