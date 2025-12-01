import styles from "./Message.module.css";

export default function Message({ message, isMy }) {
  return (
    <div className={`${styles.message} ${isMy ? styles.right : ""}`.trim()}>
      <div className={styles.avatarWrapper}>
        <img src={message.author?.avatar} alt="" className={styles.avatar} />
      </div>
      <p className={`${styles.text} ${isMy ? styles.right : ""}`.trim()}>
        {message.text}
      </p>
    </div>
  );
}
