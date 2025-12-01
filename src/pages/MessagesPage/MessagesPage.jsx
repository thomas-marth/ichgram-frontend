import { useMemo } from "react";
import { useParams } from "react-router-dom";

import currentUserAvatar from "../../assets/images/test-current-user.jpg";
import nikitaAvatar from "../../assets/images/test-user2.jpg";
import sashaaAvatar from "../../assets/images/test-user.jpg";
import Chat from "../../modules/Chat/Chat";

import styles from "./MessagesPage.module.css";

const MessagesPage = () => {
  const { id } = useParams();

  const currentUser = useMemo(
    () => ({
      id: "current-user",
      username: "itcareerhub",
      fullname: "itcareerhub",
      avatar: currentUserAvatar,
    }),
    []
  );

  const chats = useMemo(() => {
    const nikitaUser = {
      id: "chat-user-1",
      username: "nikita",
      fullname: "nikita - ichgram",
      avatar: nikitaAvatar,
    };

    const sashaaUser = {
      id: "chat-user-2",
      username: "sasha",
      fullname: "sasha - ichgram",
      avatar: sashaaAvatar,
    };

    return [
      {
        id: "chat-1",
        member1Id: currentUser.id,
        member1: currentUser,
        member2Id: nikitaUser.id,
        member2: nikitaUser,
        messages: [
          {
            id: "msg-1",
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
            authorId: nikitaUser.id,
            author: nikitaUser,
            createdAt: "2025-06-20T12:00:00Z",
          },
          {
            id: "msg-2",
            text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            authorId: currentUser.id,
            author: currentUser,
            createdAt: "2025-06-21T12:00:00Z",
          },
          {
            id: "msg-3",
            text: "Tellus at urna condimentum mattis pellentesque id nibh tortor id.",
            authorId: currentUser.id,
            author: currentUser,
            createdAt: "2025-06-22T12:00:00Z",
          },
        ],
      },
      {
        id: "chat-2",
        member1Id: currentUser.id,
        member1: currentUser,
        member2Id: sashaaUser.id,
        member2: sashaaUser,
        messages: [
          {
            id: "msg-4",
            text: "All at urna condimentum mattis pellentesque id.",
            authorId: sashaaUser.id,
            author: sashaaUser,
            createdAt: "2025-06-18T12:00:00Z",
          },
        ],
      },
    ];
  }, [currentUser]);

  return (
    <div className={styles.chatPage}>
      <Chat chats={chats} currentUser={currentUser} initialChatId={id} />
    </div>
  );
};

export default MessagesPage;
