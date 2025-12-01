import styles from "./ChatItem.module.css";

const formatRelativeWeeks = (isoDate) => {
  if (!isoDate) return null;
  const current = Date.now();
  const diff = current - new Date(isoDate).getTime();
  const weeks = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 7)));
  return `${weeks} week`;
};

const ChatItem = ({ chat, active, handleClick, currentUser }) => {
  const otherUser =
    chat.member1Id === currentUser.id ? chat.member2 : chat.member1;

  const lastMessage = (chat.messages || []).slice(-1)[0];
  const lastMessageDate = formatRelativeWeeks(lastMessage?.createdAt);
  const lastMessageText = lastMessage?.text;

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
        {!lastMessage && (
          <span className={styles.info}>
            {otherUser?.username} text a message &bull; 2 week
          </span>
        )}
        {lastMessageText && <p className={styles.preview}>{lastMessageText}</p>}
      </div>
    </button>
  );
};

export default ChatItem;
