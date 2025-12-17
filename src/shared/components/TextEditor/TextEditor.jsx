import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import Avatar from "../Avatar/Avatar";
import smileIcon from "../../../assets/icons/smile.svg";
import { selectUser } from "../../../redux/auth/authSelectors";

import styles from "./TextEditor.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const buildAvatarUrl = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http") || avatar.startsWith("/")) return avatar;
  if (baseURL) return `${baseURL}/${avatar}`;
  return avatar;
};

export default function TextEditor({
  value = "",
  onChange,
  placeholder = "",
  className = "",
}) {
  const user = useSelector(selectUser);
  const username = user?.username || "username";
  const avatarUrl = useMemo(() => buildAvatarUrl(user?.avatar), [user?.avatar]);

  const cursorPosition = useRef(0);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  useEffect(() => {
    if (!isEmojiOpen) return;

    const handleClickOutside = (event) => {
      const picker = emojiPickerRef.current;
      const button = emojiButtonRef.current;

      if (
        picker &&
        !picker.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        setIsEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEmojiOpen]);

  const handleChange = (e) => {
    cursorPosition.current = e.target.selectionStart;
    onChange(e.target.value);
  };

  const handleClick = (e) => {
    cursorPosition.current = e.target.selectionStart;
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData?.emoji;
    if (!emoji) return;

    const before = value.slice(0, cursorPosition.current);
    const after = value.slice(cursorPosition.current);

    const newValue = before + emoji + after;
    onChange(newValue);

    requestAnimationFrame(() => {
      const pos = cursorPosition.current + emoji.length;
      textareaRef.current?.setSelectionRange(pos, pos);
      cursorPosition.current = pos;
    });
  };

  return (
    <div className={`${styles.textEditor} ${className}`}>
      <div className={styles.userInfo}>
        <Avatar size="xs" src={avatarUrl} alt="User avatar" />
        <span className={styles.username}>{username}</span>
      </div>

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        placeholder={placeholder}
        maxLength={2200}
        spellCheck
        onChange={handleChange}
        onClick={handleClick}
      />

      <p className={styles.length}>{value.length}/2200</p>

      <div className={styles.emojiRow}>
        <button
          type="button"
          className={styles.emojiButton}
          ref={emojiButtonRef}
          onClick={() => setIsEmojiOpen((prev) => !prev)}
        >
          <img src={smileIcon} alt="" width={20} height={20} />
        </button>

        {isEmojiOpen && (
          <div
            className={`${styles.emojiPickerWrapper} ${styles.open}`}
            ref={emojiPickerRef}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis />
          </div>
        )}
      </div>
    </div>
  );
}
