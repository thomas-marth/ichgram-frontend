import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem/ChatItem";
import Messenger from "./Messenger/Messenger";

import styles from "./Chat.module.css";

const Chat = ({
  chats,
  currentUser,
  initialUserId,
  isLoading = false,
  error,
  messagesError,
  messagesLoading,
  onSendMessage,
}) => {
  const navigate = useNavigate();

  const chatList = useMemo(() => chats ?? [], [chats]);

  const activeChat = useMemo(() => {
    if (!initialUserId) {
      return null;
    }

    return (
      chatList.find(
        (chat) =>
          chat.member1Id === initialUserId || chat.member2Id === initialUserId
      ) ?? null
    );
  }, [chatList, initialUserId]);

  const handleClickOnChat = (chat) => {
    if (!currentUser) return;

    const otherUserId =
      chat.member1Id === currentUser.id ? chat.member2Id : chat.member1Id;

    navigate(`/direct/${otherUserId}`);
  };

  const handleSendMessage = (chatId, text) => {
    onSendMessage?.(chatId, text);
  };

  const chatElements = chatList?.map((chat) => (
    <ChatItem
      key={chat.id}
      chat={chat}
      active={chat?.id === activeChat?.id}
      handleClick={handleClickOnChat}
      currentUser={currentUser}
    />
  ));

  if (!currentUser) {
    return (
      <div className={styles.chat}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>Log in to view your messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <div className={styles.chatsWrapper}>
        <div className={styles.chatsHeader}>
          <p className={styles.chatsHeaderUsername}>{currentUser.username}</p>
        </div>
        <div className={styles.chats}>
          {isLoading ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>Loading your chats...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>Failed to load chats</p>
            </div>
          ) : chatList.length ? (
            chatElements
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                Follow users to start a conversation
              </p>
            </div>
          )}
        </div>
      </div>
      {activeChat ? (
        <Messenger
          chat={activeChat}
          currentUser={currentUser}
          error={messagesError}
          isLoading={messagesLoading}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>Start a new conversation</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
