import { useMemo, useState } from "react";

import ChatItem from "./ChatItem/ChatItem";
import Messenger from "./Messenger/Messenger";

import styles from "./Chat.module.css";

const Chat = ({ chats, currentUser, initialChatId }) => {
  const [chatList, setChatList] = useState(chats ?? []);
  const [activeChatId, setActiveChatId] = useState(
    initialChatId || chats?.[0]?.id || null
  );

  const activeChat = useMemo(
    () => chatList.find((chat) => chat.id === activeChatId),
    [activeChatId, chatList]
  );

  const handleClickOnChat = (chat) => {
    setActiveChatId(chat.id);
  };

  const handleSendMessage = (chatId, text) => {
    const newMessageId = `${chatId}-${Date.now()}`;
    const updatedChatList = chatList.map((chat) => {
      if (chat.id !== chatId) return chat;

      const message = {
        id: newMessageId,
        text,
        authorId: currentUser.id,
        author: currentUser,
        createdAt: new Date().toISOString(),
      };

      return {
        ...chat,
        messages: [...(chat.messages || []), message],
      };
    });

    setChatList(updatedChatList);
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
