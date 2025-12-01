import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import LoadingErrorOutput from "../../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import TextField from "../../../shared/components/TextField/TextField";

import Message from "./Message/Message";

import styles from "./Messenger.module.css";

export default function Messenger({ chat, currentUser, onSendMessage }) {
  const { register, handleSubmit, reset } = useForm();
  const msgBoxRef = useRef(null);

  const otherUser = useMemo(
    () => (chat.member1Id === currentUser.id ? chat.member2 : chat.member1),
    [chat.member1, chat.member1Id, chat.member2, currentUser.id]
  );

  useEffect(() => {
    if (!msgBoxRef.current) return;
    msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
  }, [chat.messages]);

  const handleOnSubmit = (values) => {
    const text = values?.text?.trim();
    if (!text) return;
    onSendMessage?.(chat.id, text);
    reset();
  };

  const messageElements = (chat.messages || []).map((message) => (
    <Message
      key={message.id}
      message={message}
      isMy={message.authorId === currentUser.id}
    />
  ));

  const lastUpdate = chat.messages?.slice(-1)[0]?.createdAt;
  const dateLabel = lastUpdate
    ? new Date(lastUpdate).toUTCString()
    : new Date().toUTCString();

  return (
    <div className={styles.messenger}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src={otherUser?.avatar} alt="" className={styles.avatar} />
        </div>
        <p className={styles.username}>{otherUser?.username}</p>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userInfoAvatarWrapper}>
          <img
            src={otherUser?.avatar}
            alt=""
            className={styles.userInfoAvatar}
          />
        </div>
        <p className={styles.userInfoUsername}>{otherUser?.username}</p>
        <p className={styles.userInfoFullname}>{otherUser?.fullname}</p>
        <Link
          to={`/profile/${otherUser?.id}`}
          className={styles.userInfoButton}
        >
          View profile
        </Link>
        <p className={styles.date}>{dateLabel}</p>
      </div>
      <div className={styles.messages} ref={msgBoxRef}>
        {messageElements}
      </div>
      <form onSubmit={handleSubmit(handleOnSubmit)} className={styles.form}>
        <TextField
          register={register}
          name="text"
          placeholder="Write message"
          className={styles.input}
        />
      </form>
      <LoadingErrorOutput loading={false} error={null} />
    </div>
  );
}
