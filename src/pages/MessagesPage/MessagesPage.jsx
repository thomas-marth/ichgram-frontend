import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Chat from "../../modules/Chat/Chat";
import { getUserFollowingApi } from "../../shared/api/follow-api";
import { selectUser } from "../../redux/auth/authSelectors";

import styles from "./MessagesPage.module.css";

const normalizeUser = (user = {}) => ({
  id: user._id || user.id || "",
  username: user.username || user.name || "",
  fullname: user.fullname || user.name || "",
  avatar: user.avatar || "",
});

const MessagesPage = () => {
  const { id: initialUserId } = useParams();
  const authUser = useSelector(selectUser);
  const authUserId = authUser?._id || authUser?.id;
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useMemo(
    () => (authUserId ? normalizeUser(authUser) : null),
    [authUser, authUserId]
  );

  useEffect(() => {
    if (!authUserId) return undefined;

    let isMounted = true;

    const fetchFollowing = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await getUserFollowingApi(authUserId);

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError);
        setFollowingUsers([]);
        setIsLoading(false);
        return;
      }

      const normalized = (data || [])
        .map((follow) => normalizeUser(follow.following || follow))
        .filter((user) => user.id && user.username);

      setFollowingUsers(normalized);
      setIsLoading(false);
    };

    fetchFollowing();

    return () => {
      isMounted = false;
    };
  }, [authUserId]);

  const chats = useMemo(() => {
    if (!currentUser) return [];

    return followingUsers.map((user) => ({
      id: `chat-${user.id}`,
      member1Id: currentUser.id,
      member1: currentUser,
      member2Id: user.id,
      member2: user,
      messages: [],
    }));
  }, [currentUser, followingUsers]);

  return (
    <div className={styles.chatPage}>
      <Chat
        chats={chats}
        currentUser={currentUser}
        initialUserId={initialUserId}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default MessagesPage;
