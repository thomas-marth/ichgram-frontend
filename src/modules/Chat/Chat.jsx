import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem/ChatItem";
import Messenger from "./Messenger/Messenger";

import styles from "./Chat.module.css";

const Chat = ({ chats, currentUser, initialUserId }) => {
  const navigate = useNavigate();
  const [localMessages, setLocalMessages] = useState({});

  const chatList = useMemo(
    () =>
      (chats ?? []).map((chat) => ({
        ...chat,
        messages: [...(chat.messages || []), ...(localMessages[chat.id] || [])],
      })),
    [chats, localMessages]
  );

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
    const otherUserId =
      chat.member1Id === currentUser.id ? chat.member2Id : chat.member1Id;

    navigate(`/direct/${otherUserId}`);
  };

  const handleSendMessage = (chatId, text) => {
    const newMessageId = `${chatId}-${Date.now()}`;
    const message = {
      id: newMessageId,
      text,
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), message],
    }));
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

  return (
    <div className={styles.chat}>
      <div className={styles.chatsWrapper}>
        <div className={styles.chatsHeader}>
          <p className={styles.chatsHeaderUsername}>{currentUser.username}</p>
        </div>
        <div className={styles.chats}>{chatElements}</div>
      </div>
      {activeChat ? (
        <Messenger
          chat={activeChat}
          currentUser={currentUser}
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
