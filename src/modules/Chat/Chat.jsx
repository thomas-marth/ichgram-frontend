import { useMemo, useState } from "react";

import ChatItem from "./ChatItem/ChatItem";
import Messenger from "./Messenger/Messenger";

import styles from "./Chat.module.css";

const Chat = ({ chats, currentUser, initialChatId }) => {
  const [localMessages, setLocalMessages] = useState({});
  const [activeChatId, setActiveChatId] = useState(
    initialChatId || chats?.[0]?.id || null
  );

  const chatList = useMemo(
    () =>
      (chats ?? []).map((chat) => ({
        ...chat,
        messages: [...(chat.messages || []), ...(localMessages[chat.id] || [])],
      })),
    [chats, localMessages]
  );

  const resolvedActiveChatId = useMemo(() => {
    if (chatList.some((chat) => chat.id === activeChatId)) {
      return activeChatId;
    }

    if (chatList.some((chat) => chat.id === initialChatId)) {
      return initialChatId;
    }

    return chatList[0]?.id ?? null;
  }, [activeChatId, chatList, initialChatId]);

  const activeChat = useMemo(
    () => chatList.find((chat) => chat.id === resolvedActiveChatId),
    [chatList, resolvedActiveChatId]
  );

  const handleClickOnChat = (chat) => {
    setActiveChatId(chat.id);
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
      {activeChat && (
        <Messenger
          chat={activeChat}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default Chat;
