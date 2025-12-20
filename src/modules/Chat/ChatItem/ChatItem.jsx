import styles from "./ChatItem.module.css";

const formatRelativeTime = (isoDate) => {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  if (Number.isNaN(date)) return null;

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return "just now";
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  const weekLabel = weeks === 1 ? "1 week" : `${weeks} weeks`;
  return `${weekLabel} ago`;
};

const ChatItem = ({ chat, active, handleClick, currentUser }) => {
  const otherUser =
    chat.member1Id === currentUser.id ? chat.member2 : chat.member1;

  const lastMessage =
    (chat.messages || []).slice(-1)[0] || chat.lastMessage || null;
  const lastMessageDate = formatRelativeTime(lastMessage?.createdAt);
  // const lastMessageText = lastMessage?.text;

  return (
    <button
      className={`${styles.chatItem} ${active ? styles.active : ""}`.trim()}
      onClick={() => handleClick(chat)}
      type="button"
    >
      <div className={styles.avatarWrapper}>
        <img src={otherUser?.avatar} alt="" className={styles.avatar} />
      </div>
      <div className={styles.infoWrapper}>
        <p className={styles.username}>{otherUser?.username}</p>
        {lastMessage && lastMessageDate && (
          <span className={styles.info}>
            {otherUser?.username} sent a message &bull; {lastMessageDate}
          </span>
        )}
        {!lastMessage && <span className={styles.info}>No messages yet</span>}
        {/* {lastMessageText && <p className={styles.preview}>{lastMessageText}</p>} */}
      </div>
    </button>
  );
};

export default ChatItem;
