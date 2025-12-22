import Avatar from "../../../shared/components/Avatar/Avatar";
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
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} h`;
  if (days < 7) return `${days} d`;
  if (weeks < 4) return `${weeks} wek`;
  if (months < 12) return `${months} mo`;

  return `${years} year`;
};

const ChatItem = ({ chat, active, handleClick, currentUser }) => {
  const otherUser =
    chat.member1Id === currentUser.id ? chat.member2 : chat.member1;

  const lastMessage =
    (chat.messages || []).slice(-1)[0] || chat.lastMessage || null;
  const lastMessageDate = formatRelativeTime(lastMessage?.createdAt);
  const lastMessageAuthor =
    lastMessage?.author ||
    (lastMessage?.authorId === currentUser.id ? currentUser : otherUser);

  return (
    <button
      className={`${styles.chatItem} ${active ? styles.active : ""}`.trim()}
      onClick={() => handleClick(chat)}
      type="button"
    >
      <div className={styles.avatarWrapper}>
        <Avatar
          size="md"
          src={otherUser?.avatar}
          alt={otherUser?.username || ""}
        />
      </div>
      <div className={styles.infoWrapper}>
        <p className={styles.username}>{otherUser?.username}</p>
        {lastMessage && lastMessageDate && (
          <span className={styles.info}>
            {lastMessageAuthor?.username} sent a message &bull;{" "}
            {lastMessageDate}
          </span>
        )}
        {!lastMessage && <span className={styles.info}>No messages yet</span>}
        {/* {lastMessageText && <p className={styles.preview}>{lastMessageText}</p>} */}
      </div>
    </button>
  );
};

export default ChatItem;
