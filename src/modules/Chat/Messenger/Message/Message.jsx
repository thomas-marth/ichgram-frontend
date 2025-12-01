import Avatar from "./../../../../shared/components/Avatar/Avatar";
import styles from "./Message.module.css";

export default function Message({ message, isMy }) {
  return (
    <div className={`${styles.message} ${isMy ? styles.right : ""}`.trim()}>
      <div className={styles.avatarWrapper}>
        <Avatar
          size="xs"
          src={message.author?.avatar}
          alt={message.author?.username || ""}
        />
      </div>
      <p className={`${styles.text} ${isMy ? styles.right : ""}`.trim()}>
        {message.text}
      </p>
    </div>
  );
}
