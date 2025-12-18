import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { getUserFollowingApi } from "../../shared/api/follow-api";
import { getMessagesWithUserApi } from "../../shared/api/message-api";
import { getSocket } from "../../shared/utils/socket";

const normalizeUser = (user = {}) => ({
  id: user._id || user.id || "",
  username: user.username || user.name || "",
  fullname: user.fullname || user.name || "",
  avatar: user.avatar || "",
});

export const useMessages = ({ currentUser, initialUserId, authUserId }) => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messagesByChatId, setMessagesByChatId] = useState({});
  const [messagesError, setMessagesError] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);

  /** QUICK LOOKUP */
  const userLookup = useMemo(() => {
    const base = currentUser?.id ? { [currentUser.id]: currentUser } : {};
    return followingUsers.reduce((acc, u) => ({ ...acc, [u.id]: u }), base);
  }, [currentUser, followingUsers]);

  const getConversationId = useCallback((a, b) => {
    return [a, b].sort().join(":");
  }, []);

  /** ADD MESSAGE TO STATE */
  const appendMessageToChat = useCallback(
    (messageDto) => {
      const convoId = getConversationId(messageDto.from, messageDto.to);

      const author = userLookup[messageDto.from] ||
        userLookup[messageDto.to] || {
          id: messageDto.from,
          username: "Unknown",
          fullname: "",
          avatar: "",
        };

      const normalized = {
        id: messageDto.id,
        text: messageDto.text,
        authorId: messageDto.from,
        author,
        createdAt: messageDto.createdAt,
      };

      setMessagesByChatId((prev) => {
        const list = prev[convoId] || [];
        if (list.some((m) => m.id === normalized.id)) return prev;

        const updated = [...list, normalized].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        return { ...prev, [convoId]: updated };
      });
    },
    [getConversationId, userLookup]
  );

  /** SOCKET MESSAGE RECEIVER */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNew = (payload) => {
      const myId = currentUser?.id;
      if (!myId) return;
      if (payload.from !== myId && payload.to !== myId) return;
      appendMessageToChat(payload);
    };

    socket.on("message:new", handleNew);

    return () => socket.off("message:new", handleNew);
  }, [appendMessageToChat, currentUser?.id]);

  /** LOAD FOLLOWING */
  useEffect(() => {
    if (!authUserId) return;

    let alive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: apiErr } = await getUserFollowingApi(authUserId);

      if (!alive) return;

      if (apiErr) {
        startTransition(() => {
          setError(apiErr);
          setFollowingUsers([]);
          setIsLoading(false);
        });
        return;
      }

      const normalized = (data || [])
        .map((f) => normalizeUser(f.following || f))
        .filter((u) => u.id && u.username);

      startTransition(() => {
        setFollowingUsers(normalized);
        setIsLoading(false);
      });
    };

    load();
    return () => {
      alive = false;
    };
  }, [authUserId]);

  /** RESET WHEN NO CHAT SELECTED */
  useEffect(() => {
    if (!initialUserId) {
      startTransition(() => {
        setMessagesLoading(false);
        setMessagesError(null);
      });
    }
  }, [initialUserId]);

  /** LOAD MESSAGES FOR SELECTED CHAT */
  useEffect(() => {
    if (!currentUser || !initialUserId || isLoading) return;

    const target = followingUsers.find((u) => u.id === initialUserId);

    if (!target) {
      startTransition(() => {
        setMessagesError("You can only message users you follow");
        setMessagesLoading(false);

        const convoId = getConversationId(currentUser.id, initialUserId);
        setMessagesByChatId((prev) => ({
          ...prev,
          [convoId]: [],
        }));
      });
      return;
    }

    let alive = true;
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 15000);

    const loadMessages = async () => {
      startTransition(() => {
        setMessagesLoading(true);
        setMessagesError(null);
      });

      try {
        const { data, error: apiErr } = await getMessagesWithUserApi(
          initialUserId,
          { signal: controller.signal }
        );

        if (!alive) return;

        if (apiErr) {
          if (apiErr.code === "ERR_CANCELED") return;
          throw apiErr;
        }

        (data || []).forEach(appendMessageToChat);
      } catch (apiErr) {
        if (!alive) return;

        if (apiErr.code !== "ERR_CANCELED") {
          startTransition(() => {
            setMessagesError(apiErr?.message || "Failed to load messages");
          });
        }
      } finally {
        clearTimeout(abortTimeout);
        if (alive) {
          startTransition(() => {
            setMessagesLoading(false);
          });
        }
      }
    };

    loadMessages();
    return () => {
      controller.abort();
      clearTimeout(abortTimeout);
      alive = false;
      startTransition(() => {
        setMessagesLoading(false);
        setMessagesError(null);
      });
    };
  }, [
    appendMessageToChat,
    currentUser,
    followingUsers,
    getConversationId,
    initialUserId,
    isLoading,
  ]);

  /** CHATS */
  const chats = useMemo(() => {
    if (!currentUser) return [];

    return followingUsers.map((u) => {
      const id = getConversationId(currentUser.id, u.id);
      return {
        id,
        member1Id: currentUser.id,
        member1: currentUser,
        member2Id: u.id,
        member2: u,
        messages: messagesByChatId[id] || [],
      };
    });
  }, [currentUser, followingUsers, getConversationId, messagesByChatId]);

  /** SEND MESSAGE */
  const handleSendMessage = useCallback(
    (chatId, text) => {
      const socket = getSocket();
      if (!socket || !currentUser) return;

      const [a, b] = chatId.split(":");
      const recipientId = a === currentUser.id ? b : a;

      socket.emit("message:send", { to: recipientId, text }, (res) => {
        if (res?.ok && res.message) {
          appendMessageToChat(res.message);
        } else if (res?.error) {
          startTransition(() => setMessagesError(res.error));
        }
      });
    },
    [appendMessageToChat, currentUser]
  );

  return {
    isLoading,
    error,
    chats,
    messagesByChatId,
    messagesError,
    messagesLoading,
    handleSendMessage,
  };
};
