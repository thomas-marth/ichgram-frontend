import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Chat from "../../modules/Chat/Chat";
import { selectUser } from "../../redux/auth/authSelectors";
import { useMessages } from "../../shared/hooks/useMessages";

import styles from "./MessagesPage.module.css";

const MessagesPage = () => {
  const { id: initialUserId } = useParams();
  const authUser = useSelector(selectUser);
  const authUserId = authUser?._id || authUser?.id;
  const accessToken = useSelector((s) => s.auth.accessToken);

  const currentUser = useMemo(
    () => (authUser ? { id: authUserId, ...authUser } : null),
    [authUser, authUserId]
  );

  const {
    chats,
    activeUserId,
    isLoading,
    error,
    messagesError,
    messagesLoading,
    handleSendMessage,
  } = useMessages({
    currentUser,
    initialUserId,
    authUserId,
    accessToken,
  });

  return (
    <div className={styles.chatPage}>
      <Chat
        chats={chats}
        currentUser={currentUser}
        activeUserId={activeUserId}
        isLoading={isLoading}
        error={error}
        messagesError={messagesError}
        messagesLoading={messagesLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MessagesPage;
