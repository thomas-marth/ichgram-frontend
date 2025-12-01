import { useMemo } from "react";
import { useParams } from "react-router-dom";

import nikitaAvatar from "../../assets/images/test-user.jpg";
import sashaaAvatar from "../../assets/images/test-user2.jpg";
import Chat from "../../modules/Chat/Chat";

import styles from "./MessagesPage.module.css";

const MessagesPage = () => {
  const { id } = useParams();

  const currentUser = useMemo(
    () => ({
      id: "1",
      username: "nikita",
      fullname: "nikita - ichgram",
      avatar: nikitaAvatar,
    }),
    []
  );

  const chats = useMemo(() => {
    const sashaaUser = {
      id: "2",
      username: "sashaa",
      fullname: "sashaa - ichgram",
      avatar: sashaaAvatar,
    };

    const nikitaUser = {
      id: currentUser.id,
      username: currentUser.username,
      fullname: currentUser.fullname,
      avatar: currentUser.avatar,
    };

    const sharedMessages = [
      {
        id: "msg-1",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        authorId: sashaaUser.id,
        author: sashaaUser,
        createdAt: "2024-06-20T12:00:00Z",
      },
      {
        id: "msg-2",
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        authorId: nikitaUser.id,
        author: nikitaUser,
        createdAt: "2024-06-21T12:00:00Z",
      },
      {
        id: "msg-3",
        text: "Tellus at urna condimentum mattis pellentesque id nibh tortor id.",
        authorId: nikitaUser.id,
        author: nikitaUser,
        createdAt: "2024-06-22T12:00:00Z",
      },
    ];

    return [
      {
        id: "chat-1",
        member1Id: nikitaUser.id,
        member1: nikitaUser,
        member2Id: sashaaUser.id,
        member2: sashaaUser,
        messages: sharedMessages,
      },
      {
        id: "chat-2",
        member1Id: nikitaUser.id,
        member1: nikitaUser,
        member2Id: sashaaUser.id,
        member2: sashaaUser,
        messages: [
          {
            id: "msg-4",
            text: "All at urna condimentum mattis pellentesque id.",
            authorId: sashaaUser.id,
            author: sashaaUser,
            createdAt: "2024-06-18T12:00:00Z",
          },
        ],
      },
    ];
  }, [currentUser]);

  return (
    <div className={styles.chatPage}>
      <Chat
        key={id || "all"}
        chats={chats}
        currentUser={currentUser}
        initialChatId={id}
      />
    </div>
  );
};

export default MessagesPage;
