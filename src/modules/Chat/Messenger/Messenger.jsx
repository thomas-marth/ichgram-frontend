import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmojiPicker from "emoji-picker-react";

import LoadingErrorOutput from "../../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import Avatar from "../../../shared/components/Avatar/Avatar";

import Message from "./Message/Message";
import smileIcon from "../../../assets/icons/smile.svg";

import styles from "./Messenger.module.css";

const formatMessengerDate = (dateInput) => {
  const date = dateInput ? new Date(dateInput) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function Messenger({
  chat,
  currentUser,
  onSendMessage,
  error,
  isLoading,
}) {
  const { register, reset, setValue, getValues } = useForm();
  const msgBoxRef = useRef(null);
  const textFieldRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const cursorPosition = useRef(0);
  const navigate = useNavigate();
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const otherUser = useMemo(
    () => (chat.member1Id === currentUser.id ? chat.member2 : chat.member1),
    [chat.member1, chat.member1Id, chat.member2, currentUser.id]
  );

  useEffect(() => {
    if (!msgBoxRef.current) return;
    msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
  }, [chat.messages]);

  useEffect(() => {
    if (!isEmojiOpen) return;

    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setIsEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEmojiOpen]);

  const handleOnSubmit = (values) => {
    const text = values?.text?.trim();
    if (!text) return;
    onSendMessage?.(chat.id, text);
    reset();
    cursorPosition.current = 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleOnSubmit(getValues());
  };

  const handleViewProfile = () => {
    navigate(`/profile/${otherUser?.id}`);
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData?.emoji;
    if (!emoji) return;

    const currentValue = getValues("text") || "";
    const position = cursorPosition.current ?? currentValue.length;
    const before = currentValue.slice(0, position);
    const after = currentValue.slice(position);
    const newValue = before + emoji + after;

    setValue("text", newValue, { shouldDirty: true });

    requestAnimationFrame(() => {
      const newPosition = position + emoji.length;
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(newPosition, newPosition);
      }
      cursorPosition.current = newPosition;
    });
  };

  const handleTextInteraction = (event) => {
    cursorPosition.current = event.target.selectionStart || 0;
  };

  const messageElements = (chat.messages || []).map((message) => (
    <Message
      key={message.id}
      message={message}
      isMy={message.authorId === currentUser.id}
    />
  ));

  const lastUpdate = chat.messages?.slice(-1)[0]?.createdAt;
  const dateLabel = formatMessengerDate(lastUpdate);

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
          <Avatar size="lg" src={otherUser?.avatar} alt={otherUser?.username} />
        </div>
        <p className={styles.userInfoUsername}>{otherUser?.username}</p>
        <p className={styles.userInfoFullname}>{otherUser?.fullname}</p>
        <Button
          variant="gray"
          onClick={handleViewProfile}
          className={styles.userInfoButton}
        >
          View profile
        </Button>
        <p className={styles.date}>{dateLabel}</p>
      </div>
      <div className={styles.messages} ref={msgBoxRef}>
        {messageElements}
      </div>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <button
            type="button"
            className={styles.emojiButton}
            ref={emojiButtonRef}
            onClick={() => setIsEmojiOpen((prev) => !prev)}
            aria-label="Add emoji"
            disabled={isLoading}
          >
            <img src={smileIcon} alt="" />
          </button>

          <TextField
            register={register}
            name="text"
            placeholder="Write message"
            className={styles.input}
            disabled={isLoading}
            inputRef={(node) => {
              textFieldRef.current = node;
            }}
            onClick={handleTextInteraction}
            onKeyUp={handleTextInteraction}
          />

          {isEmojiOpen && (
            <div className={styles.emojiPickerWrapper} ref={emojiPickerRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis />
            </div>
          )}
        </div>
      </form>
      <LoadingErrorOutput loading={isLoading} error={error} />
    </div>
  );
}
