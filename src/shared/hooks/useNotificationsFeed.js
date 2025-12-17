import { useEffect, useRef, useState } from "react";

import { getNotificationsApi } from "../api/notification-api";

const adaptNotification = (notification) => {
  const actor = notification.actor || {};
  const comment = notification.comment || {};
  const post = notification.post || comment.post;

  return {
    id: notification._id || notification.id,
    type: notification.type,
    createdAt: notification.createdAt,
    actor: {
      id: actor._id || actor.id,
      username: actor.username || "Unknown",
      avatar: actor.avatar || "",
    },
    post: post
      ? {
          id: post._id || post.id,
          image: post.image,
        }
      : null,
    comment: notification.comment
      ? {
          id: notification.comment._id || notification.comment.id,
          text: notification.comment.text,
          postId: comment.post?._id || comment.post || post?._id || post?.id,
        }
      : null,
  };
};

const useNotificationsFeed = ({ isOpen = false } = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);

  const lastSeenRef = useRef(null);
  const notificationsRef = useRef([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      setLoading((prev) => prev || notificationsRef.current.length === 0);

      const { data, error: fetchError } = await getNotificationsApi();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError);
        setLoading(false);
        return;
      }

      const mapped = (data || []).map(adaptNotification);
      setNotifications(mapped);
      setError(null);

      const newestId = mapped[0]?.id;

      if (!lastSeenRef.current && newestId) {
        lastSeenRef.current = newestId;
      }

      if (isOpen && newestId) {
        lastSeenRef.current = newestId;
        setUnseenCount(0);
      } else if (lastSeenRef.current && mapped.length) {
        const lastSeenIndex = mapped.findIndex(
          (item) => String(item.id) === String(lastSeenRef.current)
        );

        setUnseenCount(lastSeenIndex === -1 ? mapped.length : lastSeenIndex);
      } else {
        setUnseenCount(0);
      }

      setLoading(false);
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const filtered = prev.filter((item) => String(item.id) !== String(id));

      const newestId = filtered[0]?.id;

      if (!lastSeenRef.current && newestId) {
        lastSeenRef.current = newestId;
      }

      if (isOpen && newestId) {
        lastSeenRef.current = newestId;
        setUnseenCount(0);
      } else if (lastSeenRef.current && filtered.length) {
        const lastSeenIndex = filtered.findIndex(
          (item) => String(item.id) === String(lastSeenRef.current)
        );

        setUnseenCount(lastSeenIndex === -1 ? filtered.length : lastSeenIndex);
      } else {
        setUnseenCount(0);
      }

      return filtered;
    });
  };

  return { notifications, loading, error, unseenCount, removeNotification };
};

export default useNotificationsFeed;
